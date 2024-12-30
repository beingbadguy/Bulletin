import Newsletter from "../models/newsletter.model.js";
import sendMail from "../utilities/verificationToken.js";

export const subscribeToNewsletter = async (req, res) => {
  const { email } = req.body;
  try {
    // Validate input field
    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });

    // Check if the email already exists in the database
    const existingUser = await Newsletter.findOne({ email });
    if (existingUser)
      return res.status(400).json({
        success: false,
        message: "You have already subscribed the newsletter",
      });

    // Create a new newsletter subscription
    const newUser = new Newsletter({ email });
    await newUser.save();

    // Send confirmation email

    const emailTemplate = `

<html>
  <body style="font-family: Arial, sans-serif; color: #000; margin: 0; padding: 0; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      
      <!-- Header -->
      <header style="background-color: rgb(16, 185, 129); padding: 20px; text-align: center; color: #ffffff; border-radius: 8px 8px 0 0;">
        <h1>Welcome to <span style="color: rgb(239, 68, 68);">Bulletin</span></h1>
      </header>

      <!-- Content Section -->
      <section style="padding: 20px; text-align: center;">
        <h2 style="color: #000;">Thank You for Subscribing!</h2>
        <p>Hi there,</p>
        <p>You’ve successfully subscribed to our newsletter. From now on, you’ll stay updated with the latest news, insights, and special offers from <strong>Bulletin</strong>.</p>
        
        <p style="font-size: 18px; font-weight: bold; color: rgb(16, 185, 129);">What to expect?</p>
        <ul style="list-style: none; padding: 0; margin: 20px 0; text-align: left; color: #333;">
          <li style="padding: 10px 0; border-bottom: 1px solid rgb(229, 229, 229);">📧 Regular updates on trending topics</li>
          <li style="padding: 10px 0; border-bottom: 1px solid rgb(229, 229, 229);">🤑 Exclusive offers and discounts just for subscribers</li>
          <li style="padding: 10px 0; border-bottom: 1px solid rgb(229, 229, 229);">📢 Insightful articles and updates</li>
        </ul>
        
        <a href="https://bulletin.onrender.com" style="display: inline-block; background-color: rgb(16, 185, 129); color: #ffffff; padding: 10px 20px; border-radius: 5px; font-size: 16px; text-decoration: none; margin-top: 20px;">
          Explore Now
        </a>
      </section>

      <!-- Footer -->
      <footer style="background-color: rgb(229, 229, 229); padding: 10px; text-align: center; color: #666;">
        <p>If you did not subscribe to this newsletter, please ignore this email.</p>
        <p>&copy; 2024 <span style="color: rgb(239, 68, 68);">Bulletin</span>. All rights reserved.</p>
      </footer>
    </div>
  </body>
</html>

 


`;
    sendMail(email, "Bulletin: Newsletter Signed Up", ``, emailTemplate);

    res.status(201).json({
      success: true,
      message: "Successfully subscribed to the newsletter",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
