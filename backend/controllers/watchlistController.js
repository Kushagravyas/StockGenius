import User from "../models/user.js";

export const getWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      watchlist: user.watchlist,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const toggleWatchlist = async (req, res) => {
  try {
    const { symbol, name } = req.body;
    const user = await User.findById(req.user.id);

    const index = user.watchlist.findIndex((item) => item.symbol === symbol);

    if (index > -1) {
      user.watchlist.splice(index, 1);
    } else {
      user.watchlist.push({ symbol, name });
    }

    await user.save();

    //webSocket broadcast
    // broadcastWatchlistUpdate(req.user.id, user.watchlist);

    res.json({
      success: true,
      watchlist: user.watchlist,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
