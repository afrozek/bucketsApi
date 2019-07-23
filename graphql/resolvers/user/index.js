import User from '../../../api/users/users.model';
// import Post from "../../../server/models/Post";
// import Comment from "../../../server/models/Comment";

export default {
  Query: {
    user: async (parent, {_id}, context, info) => {
      return await User.findOne({_id}).exec();
    },
    users: async (parent, args, context, info) => {
      const users = await User.find({})
          .populate()
          .exec();

      return users.map((u) => ({
        _id: u._id.toString(),
        email: u.email,
      }));
    },
  },

};
