import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/keymap/sublime';
import 'codemirror/theme/monokai.css';
import 'codemirror/mode/javascript/javascript';

function Details(props) {

    function getContent(e) {
        const maxLines = e.doc.lineCount();
        props.setRecievers([]);
        
        // Convert to json
        for(let i=0; i<maxLines; i++) {
            let line = e.doc.getLine(i);
            let [addr, amount] = line.split(',');
            props.setRecievers(oldArr => [...oldArr, {address: String(addr), amount: amount}]);
        }
    }

    return(
        <div>
            <p>Smart Contract Address (BSC) </p>
            <input 
            onChange={ e => props.setTokenAddress(e.target.value) }
            value={props.tokenAddress} 
            type='text' 
            name="ERC20" 
            size='50' 
            
            />
            <br/>
            
            <p style={{marginTop: '20px'}}>Add Recipients Addresses and amount of token to send</p>
            <div style={{height: '200px'}}>
                <CodeMirror
                      value= '0xaE020F662f98DE8439b19b2c168F7B0BF8f7Dea6, 10'
                      onChange= {(e) => {getContent(e)}}
                      style={{width:'50% !important'}}
                      options={{
                        theme: 'monokai',
                        keyMap: 'sublime',
                        lineNumbers: true,
                        mode: 'javascript',
                      }}
                />
            </div>
        </div>
    );
}

export default Details;
