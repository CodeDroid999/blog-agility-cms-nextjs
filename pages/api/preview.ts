import { validatePreview, getDynamicPageURL } from "@agility/nextjs/node";

// A simple example for testing it manually from your browser.
// If this is located at pages/api/preview.js, then
// open /api/preview from your browser.
import { NextApiRequest, NextApiResponse } from "next"

const apiCall = async (req: NextApiRequest, res: NextApiResponse) => {

	//validate our preview key, also validate the requested page to preview exists
	const validationResp = await validatePreview({
		agilityPreviewKey: req.query.agilitypreviewkey,
		slug: req.query.slug
	});

	if (validationResp.error) {
		return res.status(401).end(`${validationResp.message}`)
	}

	let previewUrl = req.query.slug;

	//TODO: these kinds of dynamic links should work by default (even outside of preview)
	if (req.query.ContentID) {
		const dynamicPath = await getDynamicPageURL({ contentID: req.query.ContentID, preview: true, slug: req.query.slug });
		if (dynamicPath) {
			previewUrl = dynamicPath;
		}
	}

	//enable preview mode
	res.setPreviewData({})

	// Redirect to the slug
	//Add an extra querystring to the location header - since Netlify will keep the QS for the incoming request by default
	let url = `${previewUrl}`
	if (url.includes("?")) {
		url = `${url}&preview=1`
	} else {
		url = `${url}?preview=1`
	}

	res.writeHead(307, { Location: url })
	res.end()

}

export default apiCall