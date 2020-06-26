const ShortUrl = require('../models/ShortUrl');

//@desc Get shorturl
//@route GET /api/v1/shorturl
//@access public

exports.getShorturl = async (req, res ) => {
    try {
    const shortUrls = await ShortUrl.find().populate({
        path: 'user',
        select: 'name role'
    })
   // res.render('index', { shortUrls: shortUrls })
   res.status(500).json({ success: true, data: shortUrls})
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Server Error'})
    }
}

// //@desc Get single url
// //@route GET /api/v1/shortUrl/:id
// //@access public

exports.getSingleUrls = async (req, res) => {
    try {
        const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
      if (shortUrl == null) return res.sendStatus(404)

      shortUrl.clicks++
       shortUrl.save()

  //res.redirect(shortUrl.full)
     res.status(200).json({ success: true, data: shortUrl.full});
        
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Server Error'})
    }
}

//@desc craete urls
//@route POST  /api/v1/shorturl
//@access Private

exports.createUrls = async (req, res) => {
    try {
         //Add user to req.body
         req.body.user = req.user.id;
         const publishedUrl  = await ShortUrl.findOne({ user: req.user.id });
        //if user is not an admin , they can add one article
        if (publishedUrl && req.user.role !== 'admin') {
        return res.status(401).json({ success: false , message: 'user alraedy created short url'})
  }
         const full = req.body;
      const sort =  await ShortUrl.create(full)
       res.json({ success: true, data: sort})
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Server Error'})
    }
}