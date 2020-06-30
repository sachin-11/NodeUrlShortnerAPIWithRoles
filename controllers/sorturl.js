const ShortUrl = require('../models/ShortUrl');
const User = require('../models/User');

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
        const full = req.body;
         //Add user to req.body
         req.body.user = req.user.id;
         const publishedUrl  = await ShortUrl.findOne({ user: req.user.id });
        //if user is not an admin , they can add one article
        // console.log("---Object.values(req.user.roles)----\n",Object.values(req.user.roles));
        var alowAdmin = !req.user.roles.some(role => role.name === 'admin')
        if (publishedUrl &&  alowAdmin){
            return res.status(401).json({ success: false , message: 'user alraedy created short url'})
  }
        
      const sort =  await ShortUrl.create(full)
       res.json({ success: true, data: sort})
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Server Error'})
    }
}

exports.createShorturlByUser = async(req, res, next) => {
    try {
        let user = await User.create(req.body);
        const publishedUrl  = await ShortUrl.findOne({ user: req.user.id });
        //if user is not an admin , they can add one url
        if (publishedUrl && req.user.role !== 'admin') {
        return res.status(401).json({ success: false , message: 'user alraedy created short url'})
  }
   let shortUrl  = await ShortUrl.findOneAndUpdate({ _id: req.params.id}, { $push: { user: user._id}}, { new: true });
   res.status(200).json(shortUrl)
        
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false , message: 'Server Error'})
    }
}


exports.updateUrlshortner = async (req, res, next ) => {
    try {
        let  shorturl = await ShortUrl.findById(req.params.id);
        if (!shorturl) {
            return res.status(400).json({ success: false, message: `No url is found ${req.params.id}`})
          }

          //Make sure user is shorturl is  owner
          if (shorturl.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorize to update url shortner'})
          }

         shorturl = await ShortUrl.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true});
         res.status(200).json({ success: true, data: shorturl})
        
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false , message: 'Server Error'})
    }
}

exports.deleteUrlshortner = async (req, res, next) => {
    try {
        let  shorturl = await ShortUrl.findById(req.params.id);
        if (!shorturl) {
            return res.status(400).json({ success: false, message: `No url is found ${req.params.id}`})
          }
          //Make sure user is shorturl is  owner
          if (shorturl.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorize to delete url shortner'})
          }
          shorturl.remove();
         res.status(200).json({ success: true, data: { }})
        
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Server Error'})
    }
}





