import prisma from "../../datasource";
import { sendSMS, pusher } from "../../services";

const findOne = async (email) => {
  try {
    return await prisma.user.findFirst({ where: { email } });
  } catch (error) {
    return false;
  }
};

export const findAll = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { id: { not: Number(req.params.id) } },
    });

    res.json({
      ok: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      data: error.message,
    });
  }
};

export const store = async (req, res) => {
  try {
    const { body } = req;

    const userByEmail = await findOne(body.email);

    if (userByEmail) {
      return res.json({
        ok: true,
        data: userByEmail,
      });
    }

    body.profile_url = `https://avatars.dicebear.com/api/avataaars/${body.name}.svg`;
    const { code } = await sendSMS(body.name, body.phone_number);
    body.code_confirm = String(code);
    const user = await prisma.user.create({ data: { ...body } });

    pusher.trigger("my-chat", "my-list-contacts", {
      message: "Call to update list contacts",
    });

    res.status(201).json({
      ok: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      data: error.message,
    });
  }
};

export const validateCodeConfirm = async (req, res) => {
  const { code_confirm, email } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      code_confirm,
      email,
    },
  });

  if (!user) {
    return res.json({
      ok: false,
      data: "El codigo no es valido",
    });
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { is_confirmed: true },
  });

  res.json({
    ok: true,
    data: updatedUser,
  });
};
