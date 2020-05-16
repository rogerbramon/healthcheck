// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async (req, res) => {
  const startTime = Date.now()
  let resp = await fetch(req.query.url)
  
  res.statusCode = 200
  res.json({
    url: req.query.url,
    status: resp.status,
    timestamp: startTime,
    duration: Date.now() - startTime
  })
}
