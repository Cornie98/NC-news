
\o all_users.txt
SELECT * FROM users;

\o coding_articles.txt
SELECT * FROM articles WHERE topic = 'coding';

\o negative_votes.txt
SELECT * FROM comments WHERE votes < 0;

\o get_all_topics.txt
SELECT * FROM topics;

\o articles_by_grumpy19.txt
SELECT * FROM articles WHERE author = 'grumpy19';

\o comments_votes_over_10.txt
SELECT * FROM comments WHERE votes > 10;

\o all_comments.txt
SELECT * FROM comments;

\o top_users_by_votes.txt
SELECT username, SUM(comments.votes) AS total_votes
FROM users
JOIN comments ON users.username = comments.author
GROUP BY username
ORDER BY total_votes DESC;