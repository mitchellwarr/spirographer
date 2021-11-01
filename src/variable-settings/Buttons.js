import { useCallback, useState } from 'react';
import { useAPICallback } from 'hooks';
import { copyToClipboard } from 'lib/Utils';
import { Row, RowItem } from 'elements/Row';
import {
  randomH,
  randomP,
  randomK,
  randomK2,
} from './VariableSettingsUtils';
import './VariableSettings.scss';

const downloadFromLink = (url, config = {}) => {
  const {
    filename,
    target
  } = config || {};

  let tempLink = document.createElement('a');
  tempLink.style.display = 'none';
  tempLink.href = url;

  if (filename) tempLink.setAttribute('download', filename);
  if (target) tempLink.setAttribute('target', target);

  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
};

const svgToPNG = async (svgNode) => {
  const svgString = new XMLSerializer().serializeToString(svgNode);

  const canvas = document.createElement('canvas');
  const { width, height } = svgNode.getBoundingClientRect();
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const DOMURL = self.URL || self.webkitURL || self;

  const img = new Image();
  const svg = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = DOMURL.createObjectURL(svg);
  

  return new Promise((res) => {
    img.onload = function() {
      ctx.drawImage(img, 0, 0, parseInt(width), parseInt(height));
      let png = canvas.toDataURL('image/png');
      res(png);
      DOMURL.revokeObjectURL(png);
    };
    img.src = url;
  });
};

export const Buttons = (props) => {
  const {
    R,
    h,
    p,
    k,
    k2,
    delta,
    maxLoops,
    onChange
  } = props;
    
  const onRandomise = useCallback(
    () => onChange({
      h: randomH(R) / R,
      p: 1 / randomP(R),
      k: R / randomK(R),
      k2: R / randomK2(R),
    }),
    [onChange, R]
  );

  const [copied, setCopied] = useState();
  const onShareLink = useAPICallback(
    api => {
      let params = new URLSearchParams({
        h: h,
        p: p,
        k: k,
        k2: k2,
        delta: delta,
        loops: maxLoops
      });
      copyToClipboard(`${location.origin}${location.pathname}?${params}`);
      setCopied('Copied to clipboard');
      setTimeout(
        () => api.current && setCopied(),
        4000
      );
    },
    [
      h,
      p,
      k,
      k2,
      delta,
      maxLoops,
      setCopied
    ]
  );

  const onDownloadSVG = useCallback(
    () => {
      let svg = document.getElementById('spirograph');
      let axis = svg.querySelector('[data-component="axis"]');
      axis.style.opacity = '0';

      let svgData = new XMLSerializer().serializeToString(svg);
      downloadFromLink(`data:image/svg+xml;base64,${btoa(svgData)}`, { filename: 'spirograph.svg' });
      axis.style.opacity = '1';
    },
    []
  );

  const onDownloadPNG = useCallback(
    async () => {
      let svg = document.getElementById('spirograph');
      let axis = svg.querySelector('[data-component="axis"]');
      axis.style.opacity = '0';
      
      const link = await svgToPNG(svg);
      downloadFromLink(link, { filename: 'spirograph.png' });
      
      axis.style.opacity = '1';
    },
    []
  );

  return (
    <Row wrap spacing={8} >
      <RowItem>
        <button
          className={'variable-settings__button'}
          onClick={onRandomise}
        >
          Randomise
        </button>
      </RowItem>
      <RowItem>
        <button
          className={'variable-settings__button'}
          onClick={onShareLink}
        >
          {copied || 'Sharable link'}
        </button>
      </RowItem>
      <RowItem>
        <button
          className={'variable-settings__button'}
          onClick={onDownloadSVG}
        >
          Download SVG
        </button>
      </RowItem>
      <RowItem>
        <button
          className={'variable-settings__button'}
          onClick={onDownloadPNG}
        >
          Download PNG
        </button>
      </RowItem>
    </Row>
  );
};
