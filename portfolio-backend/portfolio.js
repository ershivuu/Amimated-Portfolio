const express = require("express");
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "shivam",
  database: "portfolio",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

const imagesPath = path.join(__dirname, "portfolio-backend", "images");
app.use("/portfolio-backend/images", express.static(imagesPath));

if (!fs.existsSync(imagesPath)) {
  fs.mkdirSync(imagesPath, { recursive: true });
}

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const uploadImage = multer({ storage: imageStorage });
// ---------

// app.put("/homeSectionSecond/:id", uploadImage.single("image"), async (req, res) => {
//     const id = req.params.id;
//     const { second_heading } = req.body;

//     let imageUrl = "";

//     if (id < 1 || id > 4) {
//       return res.status(400).json({ error: 'ID must be a valid number between 1 and 4' });
//     }

//     // Check for image upload errors
//     if (req.multerError) {
//       return res.status(400).json({ error: req.multerError.message });
//     }

//     // Get current data for the record
//     const selectQuery = "SELECT second_image_url FROM portfolio.homesectionsecond WHERE id = ?";
//     db.query(selectQuery, [id], (err, results) => {
//       if (err) {
//         return res.status(500).json({ error: err });
//       }

//       if (results.length === 0) {
//         return res.status(404).json({ error: "Data not found for the provided ID" });
//       }

//       const currentData = results[0];

//       if (req.file) {
//         imageUrl = req.file.filename;
//       } else {
//         // If no image is uploaded, use the existing image URL from the database
//         imageUrl = currentData.second_image_url;
//       }

//       // Create dynamic update strings and values
//       const updates = [];
//       const values = [];

//       if (second_heading !== undefined) {
//         updates.push('second_heading = ?');
//         values.push(second_heading);
//       }

//       if (imageUrl !== undefined) {
//         updates.push('second_image_url = ?');
//         values.push(imageUrl);
//       }

//       // Combine updates and values into a single string for cleaner syntax
//       const updateString = updates.join(', ');

//       const updateQuery = `
//         UPDATE portfolio.homesectionsecond
//         SET ${updateString}
//         WHERE id = ?
//       `;

//       values.push(id); // Add ID to the values array

//       // Execute the update using db.query and callbacks
//       db.query(updateQuery, values, (err, result) => {
//         if (err) {
//           console.error("Error updating data:", err);
//           return res.status(500).json({ error: "Error updating data" });
//         }

//         if (result.affectedRows === 0) {
//           return res.status(404).json({ error: "Data not found for the provided ID" });
//         }

//         // Delete old image if a new image is uploaded
//         if (req.file && currentData.second_image_url) {
//           const imagePath = path.join(__dirname, 'portfolio-backend', 'images', currentData.second_image_url);
//           fs.unlink(imagePath, (err) => {
//             if (err) {
//               console.log("Error deleting old image:", err);
//             }
//           });
//         }

//         res.status(200).json({ message: "Data updated successfully" });
//       });
//     });
//   });

app.put(
  "/homeSectionSecond/:id",
  uploadImage.single("image"),
  async (req, res) => {
    const id = req.params.id;
    const { second_heading } = req.body;

    let imageUrl = "";
    let originalFileName = "";

    if (id < 1 || id > 4) {
      return res
        .status(400)
        .json({ error: "ID must be a valid number between 1 and 4" });
    }

    // Check for image upload errors
    if (req.multerError) {
      return res.status(400).json({ error: req.multerError.message });
    }

    // Get current data for the record
    const selectQuery =
      "SELECT second_image_url, original_file_name FROM portfolio.homesectionsecond WHERE id = ?";
    db.query(selectQuery, [id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      if (results.length === 0) {
        return res
          .status(404)
          .json({ error: "Data not found for the provided ID" });
      }

      const currentData = results[0];

      if (req.file) {
        imageUrl = req.file.filename;
        originalFileName = req.file.originalname;
      } else {
        // If no image is uploaded, use the existing image URL and original file name from the database
        imageUrl = currentData.second_image_url;
        originalFileName = currentData.original_file_name;
      }

      // Create dynamic update strings and values
      const updates = [];
      const values = [];

      if (second_heading !== undefined) {
        updates.push("second_heading = ?");
        values.push(second_heading);
      }

      if (imageUrl !== undefined) {
        updates.push("second_image_url = ?");
        values.push(imageUrl);
      }

      if (originalFileName !== undefined) {
        updates.push("original_file_name = ?");
        values.push(originalFileName);
      }

      // Combine updates and values into a single string for cleaner syntax
      const updateString = updates.join(", ");

      const updateQuery = `
            UPDATE portfolio.homesectionsecond
            SET ${updateString}
            WHERE id = ?
        `;

      values.push(id); // Add ID to the values array

      // Execute the update using db.query and callbacks
      db.query(updateQuery, values, (err, result) => {
        if (err) {
          console.error("Error updating data:", err);
          return res.status(500).json({ error: "Error updating data" });
        }

        if (result.affectedRows === 0) {
          return res
            .status(404)
            .json({ error: "Data not found for the provided ID" });
        }

        // Delete old image if a new image is uploaded
        if (req.file && currentData.second_image_url) {
          const imagePath = path.join(
            __dirname,
            "portfolio-backend",
            "images",
            currentData.second_image_url
          );
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.log("Error deleting old image:", err);
            }
          });
        }

        res.status(200).json({ message: "Data updated successfully" });
      });
    });
  }
);
app.get("/homeSectionSecond", async (req, res) => {
  const query = "SELECT * FROM portfolio.homesectionsecond";

  db.query(query, (err, rows) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ error: "Error fetching data" });
    }

    const homeSectionSecondData = rows.map((row) => ({
      id: row.id,
      second_heading: row.second_heading,
      original_file_name: row.original_file_name,
      second_image_url: `${req.protocol}://${req.get(
        "host"
      )}/portfolio-backend/images/${row.second_image_url.split("/").pop()}`,
    }));

    res.status(200).json(homeSectionSecondData);
  });
});
app.get("/homeSectionSecond/:id", async (req, res) => {
  const id = req.params.id;

  if (id < 1 || id > 4) {
    return res
      .status(400)
      .json({ error: "ID must be a valid number between 1 and 4" });
  }

  const query = `
      SELECT * FROM portfolio.homesectionsecond WHERE id = ?
    `;

  db.query(query, [id], (err, rows) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ error: "Error fetching data" });
    }

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Data not found for the provided ID" });
    }

    const homeSectionSecondData = rows[0]; // Assuming you only expect one row

    res.status(200).json({
      id: homeSectionSecondData.id,
      second_heading: homeSectionSecondData.second_heading,
      original_file_name: homeSectionSecondData.original_file_name,
      second_image_url: `${req.protocol}://${req.get(
        "host"
      )}/portfolio-backend/images/${homeSectionSecondData.second_image_url
        .split("/")
        .pop()}`,
    });
  });
});
// ----------------------------
// app.put('/homeSectionFirst/:id', (req, res) => {
//     const { id } = req.params;
//     const { first_heading, first_content } = req.body;

//     // Validate ID
//     if (id < 1 || id > 4) {
//         return res.status(400).json({ error: 'ID must be a valid number between 1 and 4' });
//     }

//     let query = `UPDATE portfolio.homesectionfirst SET `;
//     const values = [];
//     const updates = [];

//     if (first_heading !== undefined) {
//         updates.push('first_heading = ?');
//         values.push(first_heading);
//     }

//     if (first_content !== undefined) {
//         updates.push('first_content = ?');
//         values.push(first_content);
//     }

//     // If no fields are provided
//     if (updates.length === 0) {
//         return res.status(400).json({ error: 'No fields provided for update' });
//     }

//     query += updates.join(', ') + ` WHERE id = ?`;
//     values.push(id);

//     console.log('--- Update Query ---');
//     console.log('Query:', query);
//     console.log('Values:', values);

//     db.query(query, values, (error, results) => {
//         if (error) {
//             console.error('--- Database Error ---');
//             console.error(error);
//             return res.status(500).json({ error: 'Internal Server Error' });
//         }

//         console.log('--- Update Results ---');
//         console.log('Affected rows:', results.affectedRows);

//         if (results.affectedRows === 0) {
//             return res.status(404).json({ error: 'Row not found' });
//         }

//         res.json({ message: 'Row updated successfully' });
//     });
// });

app.put("/homeSectionFirst/:id", (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (id < 1 || id > 4) {
    return res
      .status(400)
      .json({ error: "ID must be a valid number between 1 and 4" });
  }

  const { first_heading, first_content } = req.body;

  let query = `UPDATE portfolio.homesectionfirst SET `;
  const values = [];
  const updates = [];

  if (first_heading !== undefined) {
    updates.push("first_heading = ?");
    values.push(first_heading);
  }

  if (first_content !== undefined) {
    // Ensure first_content is included
    updates.push("first_content = ?");
    values.push(first_content);
  }

  // If no fields are provided
  if (updates.length === 0) {
    return res.status(400).json({ error: "No fields provided for update" });
  }

  query += updates.join(", ") + ` WHERE id = ?`;
  values.push(id);

  console.log("--- Update Query ---");
  console.log("Query:", query);
  console.log("Values:", values);

  db.query(query, values, (error, results) => {
    if (error) {
      console.error("--- Database Error ---");
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    console.log("--- Update Results ---");
    console.log("Affected rows:", results.affectedRows);

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Row not found" });
    }

    res.json({ message: "Row updated successfully" });
  });
});

app.get("/homeSectionFirst/:id", (req, res) => {
  const { id } = req.params;

  // Check if the ID is within the allowed range
  if (id < 1 || id > 4) {
    return res.status(400).json({ error: "ID must be between 1 and 4" });
  }

  const query = "SELECT * FROM portfolio.homesectionfirst WHERE id = ?";
  db.query(query, [id], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Row not found" });
    }

    res.json(results[0]);
  });
});
app.get("/homeSectionFirst", (req, res) => {
  const query = "SELECT * FROM portfolio.homesectionfirst";
  db.query(query, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "No rows found" });
    }

    res.json(results);
  });
});

// ----------------------------------------------------------------------------------------------------------
// GET all section works
app.get("/section_works", (req, res) => {
  const query = "SELECT * FROM portfolio.section_works";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    // Map results to include image URLs
    const formattedResults = results.map((item) => ({
      ...item,
      work_img: `${req.protocol}://${req.get(
        "host"
      )}/portfolio-backend/images/${item.work_img}`,
    }));

    res.json(formattedResults);
  });
});

app.get("/section_works/:id", (req, res) => {
  const id = req.params.id;
  const query =
    "SELECT * FROM portfolio.section_works WHERE idsection_works = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ error: "No data found for the provided id" });
    }

    // Map results to include image URLs
    const formattedResults = results.map((item) => ({
      ...item,
      work_img: `${req.protocol}://${req.get(
        "host"
      )}/portfolio-backend/images/${item.work_img}`,
    }));

    res.json(formattedResults[0]);
  });
});
// POST a new section work
app.post("/section_works", uploadImage.single("work_img"), (req, res) => {
  const { heading, content, project_url } = req.body;
  const work_img = req.file ? `${req.file.filename}` : null;
  const work_img_original_name = req.file ? req.file.originalname : null;

  const query =
    "INSERT INTO portfolio.section_works (heading, content, work_img,project_url, work_img_original_name) VALUES (?, ?, ?, ?, ?)";
  db.query(
    query,
    [heading, content, work_img, work_img_original_name, project_url],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      res.json({ message: "Work Added successfully" });
    }
  );
});
// PUT update a section work
app.put("/section_works/:id", uploadImage.single("work_img"), (req, res) => {
  const { id } = req.params;
  const { heading, content, project_url } = req.body;
  let work_img, work_img_original_name;

  if (req.file) {
    work_img = `${req.file.filename}`;
    work_img_original_name = req.file.originalname;
  }

  // Query to get the current values of the row
  const selectQuery =
    "SELECT heading, content,project_url, work_img, work_img_original_name FROM portfolio.section_works WHERE idsection_works = ?";
  db.query(selectQuery, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Record not found" });
    }

    const currentData = results[0];

    // Use current values if no new values are provided
    const newHeading = heading || currentData.heading;
    const newContent = content || currentData.content;
    const newProjectUrl = project_url || currentData.project_url;
    const newWorkImg = work_img || currentData.work_img;
    const newWorkImgOriginalName =
      work_img_original_name || currentData.work_img_original_name;

    const updateQuery =
      "UPDATE portfolio.section_works SET heading = ?, content = ?, project_url=?, work_img = ?, work_img_original_name = ? WHERE idsection_works = ?";
    db.query(
      updateQuery,
      [
        newHeading,
        newContent,
        newProjectUrl,
        newWorkImg,
        newWorkImgOriginalName,
        id,
      ],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: err });
        }

        // Delete old image if new image is uploaded
        if (req.file && currentData.work_img) {
          const imagePath = path.join(
            __dirname,
            "portfolio-backend",
            "images",
            currentData.work_img
          );
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.log("Error deleting old image:", err);
            }
          });
        }

        res.json({ message: "Works Updated successfully" });
      }
    );
  });
});
// DELETE a section work
app.delete("/section_works/:id", (req, res) => {
  const { id } = req.params;

  if (id === "1") {
    return res
      .status(403)
      .json({ error: "Deletion of this record is not allowed" });
  }

  // Query to get the image filename before deleting the row
  const selectQuery =
    "SELECT work_img FROM portfolio.section_works WHERE idsection_works = ?";
  db.query(selectQuery, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Record not found" });
    }

    const workImg = results[0].work_img;

    const deleteQuery =
      "DELETE FROM portfolio.section_works WHERE idsection_works = ?";
    db.query(deleteQuery, [id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      // Delete image file from folder after deleting row
      if (workImg) {
        const imagePath = path.join(imagesPath, workImg);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.log("Error deleting image:", err);
          }
        });
      }

      res.json({ message: "Section work deleted successfully" });
    });
  });
});

//   ----------------------------------------------------------------------------
// GET all section services
app.get("/section_services", (req, res) => {
  const query = "SELECT * FROM portfolio.section_services";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      const formattedResults = results.map((item) => ({
        ...item,
        section_img: `${req.protocol}://${req.get(
          "host"
        )}/portfolio-backend/images/${item.section_img}`,
      }));
      res.json(formattedResults);
    }
  });
});
app.get("/section_services/:id", (req, res) => {
  const id = req.params.id;
  const query =
    "SELECT * FROM portfolio.section_services WHERE services_id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ error: "No data found for the provided id" });
    }

    // Map results to include image URLs
    const formattedResults = results.map((item) => ({
      ...item,
    }));

    res.json(formattedResults[0]);
  });
});
app.post("/section_services", uploadImage.single("section_img"), (req, res) => {
  const { main_heading, main_content, section_heading, section_content } =
    req.body;

  const section_img = req.file ? req.file.filename : null;
  const section_img_original_name = req.file ? req.file.originalname : null;

  const query =
    "INSERT INTO portfolio.section_services (main_heading, main_content, section_img, section_img_original_name, section_heading, section_content) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [
    main_heading,
    main_content,
    section_img,
    section_img_original_name,
    section_heading,
    section_content,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: "service Added successfully" });
    }
  });
});
app.put(
  "/section_services/:id",
  uploadImage.single("section_img"),
  (req, res) => {
    const { id } = req.params;
    const { main_heading, main_content, section_heading, section_content } =
      req.body;
    let section_img, section_img_original_name;

    if (req.file) {
      section_img = `${req.file.filename}`;
      section_img_original_name = req.file.originalname;
    }

    // Fetch current data for the specified row
    const fetchQuery =
      "SELECT * FROM portfolio.section_services WHERE services_id = ?";
    db.query(fetchQuery, [id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Section service not found" });
      }

      const currentData = results[0];

      // Use current data if new data is not provided
      const updatedData = {
        main_heading: main_heading || currentData.main_heading,
        main_content: main_content || currentData.main_content,
        section_img: section_img || currentData.section_img,
        section_img_original_name:
          section_img_original_name || currentData.section_img_original_name,
        section_heading: section_heading || currentData.section_heading,
        section_content: section_content || currentData.section_content,
      };

      const updateQuery = `
            UPDATE portfolio.section_services 
            SET main_heading = ?, main_content = ?, section_img = ?, section_img_original_name = ?, section_heading = ?, section_content = ? 
            WHERE services_id = ?`;

      const updateValues = [
        updatedData.main_heading,
        updatedData.main_content,
        updatedData.section_img,
        updatedData.section_img_original_name,
        updatedData.section_heading,
        updatedData.section_content,
        id,
      ];

      db.query(updateQuery, updateValues, (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        // Delete old image if new image is uploaded
        if (req.file && currentData.section_img) {
          const imagePath = path.join(
            __dirname,
            "portfolio-backend",
            "images",
            currentData.section_img
          );
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.log("Error deleting old image:", err);
            }
          });
        }

        res.json({ message: "Section service updated successfully" });
      });
    });
  }
);
// DELETE a section service by ID
app.delete("/section_services/:id", (req, res) => {
  const { id } = req.params;

  if (id === "1") {
    return res
      .status(403)
      .json({ error: "Deletion of this record is not allowed" });
  }

  // Query to get the image filename before deleting the row
  const selectQuery =
    "SELECT section_img FROM portfolio.section_services WHERE services_id = ?";
  db.query(selectQuery, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Record not found" });
    }

    const serviceImg = results[0].section_img;

    const deleteQuery =
      "DELETE FROM portfolio.section_services WHERE services_id = ?";
    db.query(deleteQuery, [id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      // Delete image file from folder after deleting row
      if (serviceImg) {
        const imagePath = path.join(imagesPath, serviceImg);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.log("Error deleting image:", err);
          }
        });
      }

      res.json({ message: "Section service deleted successfully" });
    });
  });
});

// ----------------------------------------------------

app.get("/sliders", (req, res) => {
  const query = "SELECT * FROM portfolio.sliders";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    const formattedResults = results.map((item) => ({
      ...item,
      image_url: `${req.protocol}://${req.get(
        "host"
      )}/portfolio-backend/images/${item.image}`,
    }));

    res.json(formattedResults);
  });
});
app.get("/sliders/:id", (req, res) => {
  const sliderId = req.params.id;
  const query = "SELECT * FROM portfolio.sliders WHERE id = ?";

  db.query(query, [sliderId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Slider not found" });
    }

    const item = results[0];
    const formattedResult = {
      ...item,
      image_url: `${req.protocol}://${req.get(
        "host"
      )}/portfolio-backend/images/${item.image}`,
    };

    res.json(formattedResult);
  });
});
app.post("/sliders", uploadImage.single("image"), (req, res) => {
  const { description } = req.body;
  const image = req.file ? `${req.file.filename}` : null;
  const query =
    "INSERT INTO portfolio.sliders (image, description) VALUES (?, ?)";
  db.query(query, [image, description], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json({ message: "Work Added successfully" });
  });
});
app.put("/sliders/:id", uploadImage.single("image"), (req, res) => {
  const { id } = req.params;
  const { description } = req.body;
  const image = req.file ? `${req.file.filename}` : null;

  // Check if the record exists
  const checkQuery = "SELECT * FROM portfolio.sliders WHERE id = ?";
  db.query(checkQuery, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    const existingRecord = results[0];
    const updatedDescription = description
      ? description
      : existingRecord.description;
    const updatedImage = image ? image : existingRecord.image;

    // Update the record
    const updateQuery =
      "UPDATE portfolio.sliders SET image = ?, description = ? WHERE id = ?";
    db.query(
      updateQuery,
      [updatedImage, updatedDescription, id],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: err });
        }

        // Delete old image if new image is uploaded
        if (req.file && existingRecord.image) {
          const imagePath = path.join(
            __dirname,
            "portfolio-backend",
            "images",
            existingRecord.image
          );

          // Check if the file exists before deleting
          if (fs.existsSync(imagePath)) {
            fs.unlink(imagePath, (err) => {
              if (err) {
                console.log("Error deleting old image:", err);
              } else {
                console.log("Old image deleted successfully");
              }
            });
          } else {
            console.log("Old image not found, nothing to delete");
          }
        }

        res.json({ message: "Work updated successfully" });
      }
    );
  });
});
app.delete("/sliders/:id", (req, res) => {
  const { id } = req.params;

  // Check if the record exists
  const checkQuery = "SELECT * FROM portfolio.sliders WHERE id = ?";
  db.query(checkQuery, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    const existingRecord = results[0];

    // Delete the record
    const deleteQuery = "DELETE FROM portfolio.sliders WHERE id = ?";
    db.query(deleteQuery, [id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      // Delete associated image file if it exists
      if (existingRecord.image) {
        const imagePath = path.join(
          __dirname,
          "portfolio-backend",
          "images",
          existingRecord.image
        );

        // Check if the file exists before deleting
        if (fs.existsSync(imagePath)) {
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.log("Error deleting image:", err);
            } else {
              console.log("Image deleted successfully");
            }
          });
        } else {
          console.log("Image not found, nothing to delete");
        }
      }

      res.json({ message: "Record deleted successfully" });
    });
  });
});

// ----------------------

const os = require("os");
const ifaces = os.networkInterfaces();
let ipAddress;
Object.keys(ifaces).forEach((ifname) => {
  ifaces[ifname].forEach((iface) => {
    if (iface.family === "IPv4" && !iface.internal) {
      ipAddress = iface.address;
    }
  });
});
app.listen(PORT, () => {
  console.log(`Server is running on http://${ipAddress}:${PORT}`);
});
