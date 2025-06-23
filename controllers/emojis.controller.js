const { response } = require("../app");
const { getOrAddEmojiId, addEmojiReaction } = require("../models/emojis.model");

exports.postArticleEmoji = async (request, response, next) => {
    try {
        const { article_id } = request.params;
        const { username, emoji } = request.body;

        if (!username || !emoji) {
            return response
                .status(400)
                .send({ msg: "missing username or emoji" });
        }

        const emoji_id = await getOrAddEmojiId(emoji);
        const reaction = await addEmojiReaction(article_id, username, emoji_id);
        response.status(201).send({ reaction });
    } catch (err) {
        next(err);
    }
};
