async (
  accessToken,
  refreshToken,
  profile,
  done
) => {

  try {

    console.log("✅ GOOGLE PROFILE RECEIVED");

    console.log(profile);

    const email =
      profile.emails[0].value;

    console.log("EMAIL:", email);

    let user =
      await User.findOne({ email });

    console.log("FOUND USER:", user);

    if (!user) {

      console.log("CREATING NEW USER");

      user =
        await User.create({

          displayName:
            profile.displayName,

          email,

          password:
            "googleauth123",

          role:
            "creator",

          provider:
            "google",

          profilePic:
            profile.photos[0].value,
        });

      console.log("USER CREATED");
    }

    console.log("DONE SUCCESS");

    return done(null, user);

  } catch (error) {

    console.log("❌ GOOGLE ERROR");

    console.log(error);

    return done(error, null);
  }
}