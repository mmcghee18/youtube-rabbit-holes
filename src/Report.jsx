import React from "react";

const Report = ({ year, data }) => {
  console.log(data);
  return (
    <div>
      <h1>{year}</h1>
      <h1>Videos Watched: {data.numVideos}</h1>
      <h1>Top Channels</h1>
      <ol>
        {data.top10Channels.map(({ channel, count }) => (
          <li>
            {channel} : {count}
          </li>
        ))}
      </ol>
      <h1>Top Videos</h1>
      <ol>
        {data.top10Videos.map(({ video, count }) => (
          <li>
            {video} : {count}
          </li>
        ))}
      </ol>

      <h1>Top Words in Titles</h1>
      <ol>
        {data.top10Words.map(({ word, count }) => (
          <li>
            {word} : {count}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Report;
