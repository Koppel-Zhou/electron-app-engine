import { SetStateAction, useState } from 'react';

import './index.scss';

function MoudleButton({ prefix, set, setApi }) {
  return (
    <>
      {Object.keys(set).map((key) => {
        return set[key] instanceof Function ? (
          <li className="sideitem" onClick={() => setApi(`${prefix}.${key}`)}>
            {prefix}.{key}
          </li>
        ) : (
          <MoudleButton
            setApi={setApi}
            prefix={`${prefix}.${key}`}
            set={set[key]}
          />
        );
      })}
    </>
  );
}

function Settings() {
  const [result, setResult] = useState('');
  const [params, setParams] = useState('');
  const [api, setApi] = useState(() => {});
  return (
    <div className="settings">
      <ul className="sidebar">
        <MoudleButton setApi={setApi} prefix="IPC_R2M" set={IPC_R2M} />
      </ul>
      <div className="panel">
        <p className="title">Params</p>
        <textarea
          value={params}
          onChange={(e) => setParams(e.target.value)}
          className="params"
        />
        <button
          onClick={() => {
            const keys = api.split('.').slice(1);
            const fun = keys.reduce((pre, cur) => {
              return pre[cur];
            }, IPC_R2M);
            if (fun instanceof Function) {
              fun().then((res: SetStateAction<string>) => setResult(res));
            } else {
              alert('Please choose API');
            }
          }}
          className="title"
        >
          Call
        </button>
        <p className="title">Result</p>
        <textarea
          value={result ? JSON.stringify(result) : ''}
          disabled
          className="result"
        />
        <p className="title">Performance</p>
        <p className="performance" />
      </div>
    </div>
  );
}

export default Settings;
