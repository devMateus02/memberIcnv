import { cloudinary } from "../config/cloudinary.js";

export const uploadSelfie = async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "imageBase64 é obrigatório" });
    }

    const result = await cloudinary.uploader.upload(imageBase64, {
      folder: "church-members/selfies",
      resource_type: "image",
    });

    return res.json({ url: result.secure_url });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Erro ao enviar selfie" });
  }
};
