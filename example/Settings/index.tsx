import { SetStateAction, useState } from 'react';

import './index.scss';

function MoudleButton({ prefix, set, setResult }) {
  return (
    <>
      {Object.keys(set).map((key) => {
        return set[key] instanceof Function ? (
          <li
            className="sideitem"
            onClick={() =>
              set[key]().then((res: SetStateAction<string>) => setResult(res))
            }
          >
            {prefix}.{key}
          </li>
        ) : (
          <MoudleButton setResult={setResult} prefix={`${prefix}.${key}`} set={set[key]} />
        );
      })}
    </>
  );
}

function Settings() {
  const [result, setResult] = useState('');
  const [params, setParams] = useState('');
  // const [time, setTime] = useState('');
  console.log('>>>>>>', result);
  return (
    <div className="settings">
      <ul className="sidebar">
        <MoudleButton setResult={setResult} prefix="native" set={native} />
      </ul>
      <div className="panel">
        <p className="title">Params</p>
        <textarea value={params} onChange={(e) => setParams(e.target.value)} className="params" />
        <p className="title">Result</p>
        <textarea value={result ? JSON.stringify(result) : ''} disabled className="result" />
        <p className="title">Performance</p>
        <p className="performance"></p>
      </div>
    </div>
  );
}

export default Settings;
