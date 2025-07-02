import { RequestHandler } from "express";
import User from "../../models/user.model.js";

export const handleSearch: RequestHandler = async (req, res) => {

   if(!req?.query)return;

  try {
    const query = req?.query?.email;
    const search = await User.aggregate([
      {
        $search: {
          index:"user_search",
          text: {
            query: query,
            path: {
              wildcard:"*"
            },
          },
        },
      },
      {
        $limit: 10,
      },
      {
        $project: {
          email: 1,
          name: 1,
          picture: 1,
          isOnline:1,
          last_loggedIn:1,
          username:1,
          score: { $meta: "searchScore" },
        },
      },
    ])

    res.status(200).json({
      success: true,
      msg: "search result",
      search,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      msg: "server error",
      error,
    });
  }
};
