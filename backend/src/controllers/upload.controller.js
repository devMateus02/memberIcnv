import { cloudinary } from "../config/cloudinary.js";

// extrai o public_id de uma secure_url do Cloudinary (ex: .../upload/v123/church-members/selfies/abc123.jpg -> church-members/selfies/abc123)
function extractPublicId(url) {
  if (!url) return null;
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^./]+$/);
  return match ? match[1] : null;
}

export const uploadSelfie = async (req, res) => {
  try {
    const { imageBase64, previousUrl } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "imageBase64 é obrigatório" });
    }

    const result = await cloudinary.uploader.upload(imageBase64, {
      folder: "church-members/selfies",
      resource_type: "image",
    });

    // apaga a foto antiga (best-effort: não falha o request se der erro)
    const previousPublicId = extractPublicId(previousUrl);
    if (previousPublicId) {
      try {
        await cloudinary.uploader.destroy(previousPublicId, { resource_type: "image" });
      } catch (err) {
        console.error("Erro ao apagar selfie antiga do Cloudinary:", err);
      }
    }

    return res.json({ url: result.secure_url });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Erro ao enviar selfie" });
  }
};

export const uploadEventImage = async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "imageBase64 é obrigatório" });
    }

    const result = await cloudinary.uploader.upload(imageBase64, {
      folder: "church-events",
      resource_type: "image",
    });

    return res.json({ url: result.secure_url });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Erro ao enviar imagem" });
  }
};
