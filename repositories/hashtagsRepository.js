import db from "../config/db.js";


async function getHashtagIdByTag(hashtag) {

    let hashtags = await db.query(
        `SELECT id FROM hashtags
        WHERE tag = $1`, [hashtag]);
    if(hashtags.rowCount > 0)
        return hashtags.rows[0].id;
    
    hashtags = await db.query(
        `INSERT INTO hashtags (tag) 
        VALUES ($1)
        RETURNING id;`, [hashtag]);
    return hashtags.rows[0].id;
}

async function getTop10TrendingHashtags() {
    return db.query(
        `SELECT hashtags.tag FROM hashtags
        JOIN "postsHashtags" AS ph ON hashtags.id = ph."hashtagId"
        GROUP BY hashtags.tag
        ORDER BY COUNT (hashtags) DESC
        LIMIT 10`
    );
}

const hashtagsRepository = {getTop10TrendingHashtags, getHashtagIdByTag};

export default hashtagsRepository;