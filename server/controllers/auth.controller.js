import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import generateTokenAndSetPassword from "../utilities/generateTokenAndSetPassword.js";
import sendMail from "../utilities/verificationToken.js";
import crypto from "crypto";

export const Signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all the required fields",
      });
    }
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verficationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const newUser = new User({
      name,
      email,
      verficationToken,
      verficationExpiresIn: Date.now() + 24 * 60 * 60 * 1000,
      password: hashedPassword,
    });
    await newUser.save();
    await generateTokenAndSetPassword(res, newUser._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        ...newUser._doc,
        password: null, // Remove password from response
      },
    });
    const emailTemplate = `
 <html>
  <body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      
      <!-- Header -->
      <header style="background-color: rgb(0, 255, 162); padding: 20px; text-align: center; color: #ffffff; border-radius: 8px 8px 0 0;">
        <h1>Confirmation Code</h1>
      </header>

      <!-- Content Section -->
      <section style="padding: 20px; text-align: center;">
        <h2 style="color: #333;">You're Almost There!</h2>
        <p>Hi there,</p>
        <p>Thank you for signing up at JerseyNation! Please use the OTP code below to complete your registration.</p>
        <p style="font-size: 24px; font-weight: bold; color:rgb(0, 255, 162);"><span style="font-size: 28px;">${verficationToken}</span></p>

        <p style="font-size: 14px; color: #666;">This OTP is valid for the next 10 minutes.</p>
        
        <a href="https://jerseynation.onrender.com/otp-confirmation" style="display: inline-block; background-color:rgb(195, 248, 229); color:rgb(0, 0, 0); padding: 10px 20px; border-radius: 5px; font-size: 16px; text-decoration: none; margin-top: 20px;">
          Confirm OTP
        </a>
      </section>

      <!-- Benefits Section -->
      <section style="padding: 20px;">
        <h3 style="color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 5px;">What's Next?</h3>
        <ul style="list-style: none; padding: 0; margin: 20px 0;">
          <li style="padding: 10px 0; border-bottom: 1px solid #ddd;">🚀 Start shopping for your favorite jerseys</li>
          <li style="padding: 10px 0; border-bottom: 1px solid #ddd;">⚽ Get exclusive updates and discounts</li>
        </ul>
      </section>

      <!-- Footer -->
      <footer style="background-color: #f4f4f4; padding: 10px; text-align: center; color: #999;">
        <p>If you did not request this, please ignore this email.</p>
        <p>&copy; 2024 JerseyNation. All rights reserved.</p>
      </footer>
    </div>
  </body>
</html>


`;
    sendMail(email, "Bulletin: Verification Token", ``, emailTemplate);
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({
      success: false,
      message: "Internal Error",
    });
  }
};

export const VerifyUser = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verficationToken: code,
      verficationExpiresIn: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code",
      });
    }
    user.isVerified = true;
    user.verficationToken = undefined;
    user.verficationExpiresIn = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "You are now verified",
      data: {
        ...user._doc,
        password: null,
      },
    });

    const emailTemplate = `
 <html>
  <body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      
      <!-- Header -->
      <header style="background-color: rgb(0, 255, 162); padding: 20px; text-align: center; color: #ffffff; border-radius: 8px 8px 0 0;">
        <h1>Verification Successful</h1>
      </header>

      <!-- Content Section -->
      <section style="padding: 20px; text-align: center;">
        <h2 style="color: #333;">You're All Set!</h2>
        <p>Hi there,</p>
        <p>Congratulations! Your email has been successfully verified, and you can now access all the exciting features of JerseyNation.</p>
        
        <p style="font-size: 18px; font-weight: bold; color: #007bff;">What to do next?</p>
        <ul style="list-style: none; padding: 0; margin: 20px 0;">
          <li style="padding: 10px 0; border-bottom: 1px solid #ddd;">🚀 Explore and shop your favorite jerseys</li>
          <li style="padding: 10px 0; border-bottom: 1px solid #ddd;">⚽ Stay updated with exclusive offers and discounts</li>
        </ul>
        
        <a href="https://jerseynation.onrender.com/shop" style="display: inline-block; background-color: rgb(0, 255, 162); color: #ffffff; padding: 10px 20px; border-radius: 5px; font-size: 16px; text-decoration: none; margin-top: 20px;">
          Start Shopping
        </a>
      </section>

      <!-- Footer -->
      <footer style="background-color: #f4f4f4; padding: 10px; text-align: center; color: #999;">
        <p>If you did not request this, please ignore this email.</p>
        <p>&copy; 2024 JerseyNation. All rights reserved.</p>
      </footer>
    </div>
  </body>
</html>

`;
    sendMail(user.email, "Bulletin: User Verified", ``, emailTemplate);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const ResetPasswordAttempt = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpirationIn = Date.now() + 1 * 60 * 60 * 1000;
    user.resetToken = token;
    user.resetTokenExpiresIn = tokenExpirationIn;
    await user.save();

    const emailTemplate = `
 <html>
  <body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      
      <!-- Header -->
      <header style="background-color: rgb(0, 123, 255); padding: 20px; text-align: center; color: #ffffff; border-radius: 8px 8px 0 0;">
        <h1>Password Reset Request</h1>
      </header>

      <!-- Content Section -->
      <section style="padding: 20px; text-align: center;">
        <h2 style="color: #333;">Forgot Your Password?</h2>
        <p>Hi there,</p>
        <p>We received a request to reset your password for your JerseyNation account.</p>
        <p style="margin: 20px 0; font-size: 16px; color: #666;">
          If you made this request, click the button below to reset your password. If you didn't make this request, you can ignore this email.
        </p>

        <a href="http://localhost:5173/reset-password/${token}" style="display: inline-block; background-color: rgb(0, 123, 255); color: #ffffff; padding: 12px 25px; border-radius: 5px; font-size: 16px; text-decoration: none; margin-top: 20px;">
          Reset Your Password
        </a>
        
        <p style="font-size: 14px; color: #666; margin-top: 20px;">The reset password link is valid for the next 30 minutes.</p>
      </section>

      <!-- Tips Section -->
      <section style="padding: 20px;">
        <h3 style="color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 5px;">Tips for a Secure Password</h3>
        <ul style="list-style: none; padding: 0; margin: 20px 0;">
          <li style="padding: 10px 0; border-bottom: 1px solid #ddd;">🔒 Use a mix of upper and lowercase letters</li>
          <li style="padding: 10px 0; border-bottom: 1px solid #ddd;">📄 Include numbers and special characters</li>
          <li style="padding: 10px 0;">🚫 Avoid using easily guessed words</li>
        </ul>
      </section>

      <!-- Footer -->
      <footer style="background-color: #f4f4f4; padding: 10px; text-align: center; color: #999;">
        <p>If you did not request this, please ignore this email.</p>
        <p>&copy; 2024 JerseyNation. All rights reserved.</p>
      </footer>
    </div>
  </body>
</html>


`;
    sendMail(email, "Bulletin: Reset Password", ``, emailTemplate);

    return res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const confirmPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiresIn: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Expired or invalid token",
      });
    }
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const newPassword = await bcrypt.hash(password, 10);
    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiresIn = undefined;
    await user.save();
    await generateTokenAndSetPassword(res, user._id);

    const emailTemplate = `

    <html>
  <body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      
      <!-- Header -->
      <header style="background-color: rgb(0, 255, 162); padding: 20px; text-align: center; color: #ffffff; border-radius: 8px 8px 0 0;">
        <h1>Verification Successful</h1>
      </header>

      <!-- Content Section -->
      <section style="padding: 20px; text-align: center;">
        <h2 style="color: #333;">You're All Set!</h2>
        <p>Hi there,</p>
        <p>Congratulations! Your email has been successfully verified, and you can now access all the exciting features of JerseyNation.</p>
        
        <p style="font-size: 18px; font-weight: bold; color: #007bff;">What to do next?</p>
        <ul style="list-style: none; padding: 0; margin: 20px 0;">
          <li style="padding: 10px 0; border-bottom: 1px solid #ddd;">🚀 Explore and shop your favorite jerseys</li>
          <li style="padding: 10px 0; border-bottom: 1px solid #ddd;">⚽ Stay updated with exclusive offers and discounts</li>
        </ul>
        
        <a href="https://jerseynation.onrender.com/shop" style="display: inline-block; background-color: rgb(0, 255, 162); color: #ffffff; padding: 10px 20px; border-radius: 5px; font-size: 16px; text-decoration: none; margin-top: 20px;">
          Start Shopping
        </a>
      </section>

      <!-- Footer -->
      <footer style="background-color: #f4f4f4; padding: 10px; text-align: center; color: #999;">
        <p>If you did not request this, please ignore this email.</p>
        <p>&copy; 2024 JerseyNation. All rights reserved.</p>
      </footer>
    </div>
  </body>
</html>
 


`;
    sendMail(user.email, "Bulletin: Password Changed", ``, emailTemplate);
    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    if (user && user.isVerified === false) {
      return res.status(200).json({
        success: true,
        message: "Check your mail and verify your account",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    await generateTokenAndSetPassword(res, user._id);
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        ...user._doc,
        password: null,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });
    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
