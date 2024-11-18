import React from 'react';

export default function Box({ srcImg, holdDonut, id, isHeld }) {
  return (
    <div
      className="donut--box"
      onClick={() => holdDonut(id)}
      style={{
        backgroundColor: isHeld ? 'rgb(233, 247, 159)' : 'rgb(242, 210, 250)',
      }}
    >
      <img src={srcImg} alt="donut" className="donut--img" id={id} />
    </div>
  );
}
