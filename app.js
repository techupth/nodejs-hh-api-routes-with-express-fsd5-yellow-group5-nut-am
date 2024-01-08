// Start coding here
import express from "express";
import { assignments } from "./data/assignments.js";
import { comments } from "./data/comments.js";

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let assignmentsData = [...assignments];
let commentsData = [...comments];

app.get("/assignments", (req, res) => {
  const limit = req.query.limit;

  if (limit > 100) {
    return res.status(401).json({
      message: "Invalid request. Can fetch up to 100 posts per request.",
    });
  }

  const dataLimit = assignmentsData.slice(0, limit);

  return res.json({
    message: "Complete Fetching assignments",
    data: dataLimit,
  });
});

app.get("/assignments/:assignmentsId", (req, res) => {
  let postIdFromClient = Number(req.params.assignmentsId);
  let postdata = assignmentsData.filter((item) => item.id === postIdFromClient);

  if (!postdata[0]) {
    return res.json({ message: "No data found" });
  }

  return res.json({
    message: "Complete Fetching assignments",
    data: postdata[0],
  });
});

app.post("/assignments", (req, res) => {
  const addPostFromClient = req.body;

  assignmentsData.push({
    id: assignmentsData[assignmentsData.length - 1].id + 1,
    ...addPostFromClient,
  });

  return res.json({
    message: "New assignment has been created successfully",
    data: assignmentsData,
  });
});

app.delete("/assignments/:assignmentsId", (req, res) => {
  let postIdFromClient = Number(req.params.assignmentsId);

  let postdata = assignmentsData.filter((item) => item.id !== postIdFromClient);

  assignmentsData = postdata;

  if (!postdata) {
    return res.json({ message: "Cannot delete, No data available!" });
  }

  return res.json({
    message: `Assignment Id : ${postIdFromClient} has been deleted successfully`,
  });
});

app.put("/assignments/:assignmentsId", (req, res) => {
  let postIdFromClient = Number(req.params.assignmentsId);
  const updatePost = { ...req.body };

  const dataIndex = assignmentsData.filter((item) => {
    return item.id === postIdFromClient;
  });

  assignmentsData[dataIndex] = { id: postIdFromClient, ...updatePost };

  if (!dataIndex) {
    return res.json({ message: "Cannot update, No data available!" });
  }

  return res.json({
    message: `Assignment Id : ${postIdFromClient} has been updated successfully`,
    data: assignmentsData[dataIndex],
  });
});

app.get("/assignments/:assignmentId/comments", (req, res) => {
  let commentsIdFromClient = Number(req.params.assignmentId);
  let commentIndex = commentsData.filter(
    (item) => item.assignmentId === commentsIdFromClient
  );

  if (!commentIndex.length) {
    return res.json({ message: "not fount comment section" });
  }

  return res.json({
    message: "Complete fetching comments",
    data: commentIndex,
  });
});

app.post("/assignments/:assignmentId/comments", (req, res) => {
  commentsData.push({
    id: commentsData[commentsData.length - 1].id + 1,
    ...req.boby,
  });

  return res.json({
    message: "New comment has been created successfully",
    data: commentsData,
  });
});

app.listen(port, () => {
  console.log(`Server is runing at ${port}`);
});
