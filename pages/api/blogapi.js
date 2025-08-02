import mongooseconnect from "@/lib/mongoose";
import { Blog } from "@/models/blog";
import formidable from "formidable";
import fs from "fs";
import path from "path";

// Disable default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handle(req, res) {
  await mongooseconnect();

  const method = req.method;

  // Only run this part for POST with image upload
  if (method === "POST") {
  return new Promise((resolve, reject) => {
    const uploadDir = path.join(process.cwd(), "public/uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({
      uploadDir,
      keepExtensions: true,
      multiples: false,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Form parse error:", err);
        res.status(500).json({ error: "Error parsing the form" });
        return reject(err);
      }

      const title = fields.title?.[0] || "";
      const slug = fields.slug?.[0] || "";
      const description = fields.description?.[0] || "";
      const category = fields.category?.[0] || "";
      const tags = fields.tags?.[0] || "";
      const status = fields.status?.[0] || "";

      const imageFile = files.image?.[0];

      if (!imageFile) {
        res.status(400).json({ error: "Image file is missing" });
        return resolve();
      }

      const originalFilename = imageFile.originalFilename || imageFile.newFilename || "uploaded.png";
      const ext = path.extname(originalFilename);
      const newFileName = `${Date.now()}${ext}`;
      const newFilePath = path.join(uploadDir, newFileName);

      fs.renameSync(imageFile.filepath, newFilePath);

      try {
        const blogDoc = await Blog.create({
          title,
          slug,
          description,
          category,
          tags,
          status,
          image: `/uploads/${newFileName}`,
        });

        res.status(201).json(blogDoc);
        return resolve();
      } catch (dbErr) {
        console.error("DB save error:", dbErr);
        res.status(500).json({ error: "Database save failed", details: dbErr.message });
        return reject(dbErr);
      }
    });
  });
}


  // Handle GET all / by ID
  else if (method === "GET") {
    if (req.query?.id) {
      const blog = await Blog.findById(req.query.id);
      return res.status(200).json(blog);
    } else {
      const blogs = await Blog.find().sort({ createdAt: -1 });
      return res.status(200).json(blogs);
    }
  }

  // Handle PUT
  else if (method === "PUT") {
    const { _id, title, slug, description, category, tags, status } = req.body;

    await Blog.updateOne(
      { _id },
      { title, slug, description, category, tags, status }
    );

    return res.status(200).json({ message: "Updated successfully" });
  }

  // Handle DELETE
  else if (method === "DELETE") {
    if (req.query?.id) {
      await Blog.deleteOne({ _id: req.query?.id });
      return res.status(200).json({ message: "Deleted successfully" });
    }
  }

  // Invalid method
  return res.status(405).json({ error: "Method Not Allowed" });
}
