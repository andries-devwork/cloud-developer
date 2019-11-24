import { Router, Request, Response } from 'express';
import {filterImageFromURL, deleteLocalFiles} from '../../../../util/util';

const router: Router = Router();

// GET /filteredimage?image_url={{URL}}
// endpoint to filter an image from a public url.
// IT SHOULD
//    1. validate the image_url query
//    2. call filterImageFromURL(image_url) to filter the image
//    3. send the resulting file in the response
//    4. deletes any files on the server on finish of the response
// QUERY PARAMETERS
//    image_url: URL of a publicly accessible image
// RETURNS
//   the filtered image file [!!TIP res.sendFile(filteredImagePath); might be useful]
router.get('/',
    async (req: Request, res: Response) => {
    const url = req.query.image_url
    let localFiles = new Array<string>();
    
    if (!url || url==="") {
        res.status(422).send('An image url is required as a query parameter: image_url')
    }

    let filteredImagePath = await filterImageFromURL(url);
    
    // Need a helper function that doesn't take parameters for the sendFile callback
    function cleanup() {
        localFiles.push(filteredImagePath);
        deleteLocalFiles(localFiles)
    }

    res.status(200).sendFile(filteredImagePath, cleanup);
});

export const FilteredImageRouter: Router = router;