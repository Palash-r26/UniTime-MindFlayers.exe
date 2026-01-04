// server/controllers/aiController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getSmartSchedule = async (req, res) => {
  const { studentData, availableTime } = req.body;
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Student has ${availableTime} minutes. 
                  Upcoming: ${studentData.upcomingExams}. 
                  Weak topics: ${studentData.learningGaps}. 
                  Suggest 1 primary and 2 alternative study tasks.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  res.json({ recommendation: response.text() });
};