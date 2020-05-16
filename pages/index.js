import Head from 'next/head'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'


export default function Home(props) {
  const router = useRouter()
  const [series, setSeries] = useState([])
  const [lastCheck, setLastCheck] = useState({
    status: 'checking',
    duration: '500',
    time: '09:41:00 AM'
  })
  const [exampleUrl, setExampleUrl] = useState('')

  let statusCodeToColor = (status) => {
    const color = status >= 500 ? '#d62728' // orange
                : status >= 400 ? '#d62728' // red
                : status >= 300 ? '#1f77b4' // blue
                : status >= 200 ? '#2ca02c' // green
                : '#666666'
    return color;
  }

  let timer = () => setInterval(async () => {
    const res = await fetch(`/api/check?url=${router.query.url}`)
    const body = await res.json()
    const color = statusCodeToColor(body.status)
    const time = new Date(body.timestamp).toLocaleTimeString('en-US')

    const lastCheck = {
      key: body.timestamp,
      status: body.status,
      duration: body.duration,
      time: time,
      color: color
    }
    setLastCheck(lastCheck)
    setSeries([lastCheck].concat(series));
  }, 5000)

  useEffect(() => {
    
    if (router.query.url === undefined) {
      setExampleUrl(`${window.location.protocol}//${window.location.host}/?url=https://vercel.com`)

      return
    }

    let timerID = timer()

    return () => {
      clearInterval(timerID)
    }
  });

  return (
    <div className="container">
      <Head>
        <title>Check your website</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
      {(router.query.url === undefined)?
        <>
          <h1 className="title">
            Missing <code>url</code> parameter.
          </h1>
          <h3>
            Try with <a href={exampleUrl}>{exampleUrl}</a>
          </h3>
        </>
      :
        <>
          <h1 className="title">
            Checking <a href={router.query.url}>{router.query.url}</a> <span className="interval">every 5 seconds</span>
          </h1>
          <div href="https://nextjs.org/learn" className={`card ${lastCheck.status === 'checking'? 'is-loading': ''}`} style={{color: lastCheck.color, borderColor: lastCheck.color}}>
            <h3>Last check</h3>
            <p>Status: {lastCheck.status}</p>
            <p>Duration: {lastCheck.duration}ms</p>
            <p>Time: {lastCheck.time}</p>
          </div>
          <h3>History</h3>
          <div className="grid">
            {series.map(check => (
              <div className="ping" key={check.key} style={{backgroundColor: check.color}}>
                <div className="tooltiptext">
                  Status: {check.status}<br/>
                  Duration: {check.duration}ms<br/>
                  Time: {check.time}<br/>
                </div>
              </div>
            ))}
          </div>
        </>
      }
      </main>
      <style jsx>{`
        .card {
          margin: 1.5rem 0;
          flex-basis: 45%;
          padding: 1rem 1rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
          max-width 300px;
        }

        h3 {
          margin: 0 0 1rem 0;
          font-size: 1.3rem;
        }

        .card p {
          margin: 0;
          margin-bottom: 2px;
          font-size: 1rem;
          line-height: 1.5;
          position: relative;
        }
        .card.is-loading p {
          overflow: hidden;
        }
        .card.is-loading p::after {
          content: ' ';
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          background-color: lightgray;
          border-radius: 2px;
        }
        .card.is-loading p::before {
          content: '';
          display: block;
          position: absolute;
          left: -150px;
          top: 0;
          height: 100%;
          width: 150px;
          background: linear-gradient(to right, transparent 0%, #E8E8E8 50%, transparent 100%);
          animation: load 2s cubic-bezier(0.4, 0.0, 0.2, 1) infinite;
          z-index: 10;
        }

        @keyframes load {
          from {
            left: -150px;
          }
          to   {
            left: 100%;
          }
        }

        .logo {
          height: 1em;
        }

        .ping {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin: 0 1px 3px 2px;
          position: relative;
        }
        .ping .tooltiptext {
          visibility: hidden;
          background-color: black;
          color: #fff;
          text-align: left;
          width: 160px;
          border-radius: 6px;
          padding: 12px;
          position: absolute;
          z-index: 1;
          top: 150%;
          left: 50%;
          margin-left: -80px;
          font-size: 0.8em;
        }

        .ping .tooltiptext::after {
          content: "";
          position: absolute;
          bottom: 100%;
          left: 50%;
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: transparent transparent black transparent;
        }

        .ping:hover .tooltiptext {
          visibility: visible;
        }

        .container {
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 2.5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          width: 600px;
          margin: 0 auto;
        }

        a {
          color: #0070f3;
          text-decoration: none;
        }

        a:hover,
        a:focus,
        a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 1.5rem;
        }

        .title,
        .description {
          text-align: left;
        }

        .interval {
          font-size: 0.7em;
          font-weight: normal;
          color: gray;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.55rem;
          display: inline-block;
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          flex-wrap: wrap;
        }

        @media (max-width: 600px) {
          main {
            width: 100%;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}
