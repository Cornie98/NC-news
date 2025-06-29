const { response } = require("../app");
const { getOrAddEmojiId, addEmojiReaction } = require("../models/emojis.model");

exports.postArticleEmoji = async (request, response, next) => {
    try {
        const emojiRegex = /^\p{Emoji}$/u;
        const { article_id } = request.params;
        const { username, emoji } = request.body;

        if (!username || !emoji) {
            return response
                .status(400)
                .send({ msg: "missing username or emoji" });
        }

        if (!emojiRegex.test(emoji)) {
            return response.status(400).send({ msg: "invalid emoji" });
        }
        const emoji_id = await getOrAddEmojiId(emoji);
        const reaction = await addEmojiReaction(article_id, username, emoji_id);
        response.status(201).send({ reaction });
    } catch (err) {
        next(err);
    }
};
const { getEmojiReactionsByArticleId } = require("../models/emojis.model");

exports.getArticleEmojis = async (req, res, next) => {
    try {
        const { article_id } = req.params;
        const reactions = await getEmojiReactionsByArticleId(article_id);
        res.status(200).send({ reactions });
    } catch (err) {
        next(err);
    }
};
