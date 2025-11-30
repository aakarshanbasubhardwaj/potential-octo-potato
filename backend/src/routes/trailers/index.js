import express from "express";
import config from '../../config/config.js'

const router = express.Router();
const { YT_API_KEY, REGION } = config

router.get("/getTrailers", async (req, res) => {
  try {
    const query = encodeURIComponent("latest trailers");
    const maxResults = 10;

    const searchRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=${maxResults}&q=${query}&videoDuration=short&regionCode=${REGION}&key=${YT_API_KEY}`
    );

    if (!searchRes.ok) {
      return res.status(searchRes.status).json({ message: `YouTube API error: ${searchRes.statusText}` });
    }

    const searchData = await searchRes.json();
    const ids = searchData.items.map(i => i.id.videoId).join(",");

    if (!ids) return res.status(200).json({ trailers: [] });

    const detailsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,status,snippet&id=${ids}&key=${YT_API_KEY}`
    );

    const detailsData = await detailsRes.json();

    const filtered = detailsData.items.filter(video => {
      if (!video.status.embeddable) return false;

      const blocked = video.contentDetails.regionRestriction?.blocked;
      if (blocked && blocked.includes(REGION)) return false;

      return true;
    });

    const trailers = filtered.map(video => ({
      videoId: video.id,
      title: video.snippet.title,
      thumbnail: video.snippet.thumbnails.high.url
    }));

    return res.status(200).json({ trailers });

  } catch (err) {
    console.error("Error fetching trailers:", err);
    return res.status(500).json({ message: `Internal Server Error: ${err.message}` });
  }
});


export default router;
