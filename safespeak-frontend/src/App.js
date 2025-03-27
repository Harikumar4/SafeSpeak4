// import React, { useState, useEffect } from 'react';
// import styled, { createGlobalStyle } from 'styled-components';
// import { io } from 'socket.io-client';

// // Global Styles
// const GlobalStyle = createGlobalStyle`
//   body {
//     margin: 0;
//     font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
//     background-color: #f4f6f9;
//     line-height: 1.6;
//   }

//   * {
//     box-sizing: border-box;
//   }
// `;

// // Styled Components
// const AppContainer = styled.div`
//   max-width: 1200px;
//   margin: 0 auto;
//   padding: 20px;
// `;

// const Header = styled.header`
//   background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
//   color: white;
//   padding: 20px;
//   border-radius: 12px;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   box-shadow: 0 10px 25px rgba(0,0,0,0.1);
// `;

// const Title = styled.h1`
//   margin: 0;
//   font-size: 24px;
//   display: flex;
//   align-items: center;
// `;

// const RecordButton = styled.button`
//   background-color: ${props => props.recording ? '#ff4d4d' : '#4CAF50'};
//   color: white;
//   border: none;
//   padding: 12px 24px;
//   border-radius: 30px;
//   cursor: pointer;
//   display: flex;
//   align-items: center;
//   transition: all 0.3s ease;
//   font-weight: bold;
  
//   &:hover {
//     transform: scale(1.05);
//     box-shadow: 0 5px 15px rgba(0,0,0,0.2);
//   }

//   svg {
//     margin-right: 10px;
//   }
// `;

// const ContentGrid = styled.div`
//   display: grid;
//   grid-template-columns: 1fr 1fr;
//   gap: 20px;
//   margin-top: 20px;

//   @media (max-width: 768px) {
//     grid-template-columns: 1fr;
//   }
// `;

// const Panel = styled.div`
//   background-color: white;
//   border-radius: 12px;
//   box-shadow: 0 5px 15px rgba(0,0,0,0.1);
//   padding: 20px;
// `;

// const TranscriptItem = styled.div`
//   background-color: ${props => props.type === 'safe' ? '#e6f3e6' : '#f3e6e6'};
//   border-left: 5px solid ${props => props.type === 'safe' ? '#4CAF50' : '#ff4d4d'};
//   padding: 10px;
//   margin-bottom: 10px;
//   border-radius: 5px;
// `;

// const SafeSpeakApp = () => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [transcriptions, setTranscriptions] = useState([]);
//   const [fraudAnalyses, setFraudAnalyses] = useState([]);
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     // Socket connection setup
//     const newSocket = io('http://localhost:5000', {
//       transports: ['websocket'],
//       cors: {
//         origin: "http://localhost:3000",
//         methods: ["GET", "POST"]
//       }
//     });

//     newSocket.on('connect', () => {
//       console.log('Socket connected');
//       setSocket(newSocket);
//     });

//     // Transcription listener
//     newSocket.on('transcription', (data) => {
//       setTranscriptions(prev => [...prev, {
//         text: data.transcription,
//         timestamp: new Date().toLocaleString()
//       }]);
//     });

//     // Fraud analysis listener
//     newSocket.on('fraud_analysis', (data) => {
//       setFraudAnalyses(prev => [...prev, {
//         result: data.fraud_analysis,
//         timestamp: new Date().toLocaleString()
//       }]);
//     });

//     return () => {
//       if (newSocket) newSocket.disconnect();
//     };
//   }, []);

//   const startRecording = () => {
//     if (socket) {
//       socket.emit('message', { action: 'start_recording' });
//       setIsRecording(true);
//     }
//   };

//   const stopRecording = () => {
//     if (socket) {
//       socket.emit('message', { action: 'stop_recording' });
//       setIsRecording(false);
//     }
//   };

//   return (
//     <>
//       <GlobalStyle />
//       <AppContainer>
//         <Header>
//           <Title>
//             🛡️ SafeSpeak: Fraud Detection
//           </Title>
//           <RecordButton 
//             onClick={isRecording ? stopRecording : startRecording}
//             recording={isRecording}
//           >
//             {isRecording ? '⏹️ Stop Recording' : '🎙️ Start Recording'}
//           </RecordButton>
//         </Header>

//         <ContentGrid>
//           <Panel>
//             <h2>Transcriptions</h2>
//             {transcriptions.map((trans, index) => (
//               <TranscriptItem key={index} type="neutral">
//                 <p>{trans.text}</p>
//                 <small>{trans.timestamp}</small>
//               </TranscriptItem>
//             ))}
//           </Panel>

//           <Panel>
//             <h2>Fraud Analysis</h2>
//             {fraudAnalyses.map((analysis, index) => (
//               <TranscriptItem 
//                 key={index} 
//                 type={analysis.result.includes('SAFE') ? 'safe' : 'fraud'}
//               >
//                 <p>{analysis.result}</p>
//                 <small>{analysis.timestamp}</small>
//               </TranscriptItem>
//             ))}
//           </Panel>
//         </ContentGrid>
//       </AppContainer>
//     </>
//   );
// };

// export default SafeSpeakApp;
import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { io } from 'socket.io-client';

// Global Styles
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    background-color: #f4f6f9;
    line-height: 1.6;
  }

  * {
    box-sizing: border-box;
  }
`;

// Styled Components
const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.header`
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  display: flex;
  align-items: center;
`;

const RecordButton = styled.button`
  background-color: ${props => props.recording ? '#ff4d4d' : '#4CAF50'};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  font-weight: bold;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }

  svg {
    margin-right: 10px;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  padding: 20px;
`;

const TranscriptItem = styled.div`
  background-color: ${props => props.type === 'safe' ? '#e6f3e6' : '#f3e6e6'};
  border-left: 5px solid ${props => props.type === 'safe' ? '#4CAF50' : '#ff4d4d'};
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
`;

const SafeSpeakApp = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptions, setTranscriptions] = useState([]);
  const [fraudAnalyses, setFraudAnalyses] = useState([]);
  const [deepfakeAnalyses, setDeepfakeAnalyses] = useState([]); // New state for deepfake results
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Socket connection setup
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket'],
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      setSocket(newSocket);
    });

    // Transcription listener
    newSocket.on('transcription', (data) => {
      setTranscriptions(prev => [...prev, {
        text: data.transcription,
        timestamp: new Date().toLocaleString()
      }]);
    });

    // Fraud analysis listener
    newSocket.on('fraud_analysis', (data) => {
      setFraudAnalyses(prev => [...prev, {
        result: data.fraud_analysis,
        timestamp: new Date().toLocaleString()
      }]);
    });

    // Deepfake analysis listener
    newSocket.on('deepfake_analysis', (data) => {
      setDeepfakeAnalyses(prev => [...prev, {
        result: data.deepfake_analysis,
        timestamp: new Date().toLocaleString()
      }]);
    });

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, []);

  const startRecording = () => {
    if (socket) {
      socket.emit('message', { action: 'start_recording' });
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (socket) {
      socket.emit('message', { action: 'stop_recording' });
      setIsRecording(false);
    }
  };

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Header>
          <Title>
            🛡️ SafeSpeak: Fraud Detection
          </Title>
          <RecordButton 
            onClick={isRecording ? stopRecording : startRecording}
            recording={isRecording}
          >
            {isRecording ? '⏹️ Stop Recording' : '🎙️ Start Recording'}
          </RecordButton>
        </Header>

        <ContentGrid>
          <Panel>
            <h2>Transcriptions</h2>
            {transcriptions.map((trans, index) => (
              <TranscriptItem key={index} type="neutral">
                <p>{trans.text}</p>
                <small>{trans.timestamp}</small>
              </TranscriptItem>
            ))}
          </Panel>

          <Panel>
            <h2>Fraud Analysis</h2>
            {fraudAnalyses.map((analysis, index) => (
              <TranscriptItem 
                key={index} 
                type={analysis.result.includes('SAFE') ? 'safe' : 'fraud'}
              >
                <p>{analysis.result}</p>
                <small>{analysis.timestamp}</small>
              </TranscriptItem>
            ))}
          </Panel>

          <Panel>
            <h2>Deepfake Detection</h2>
            {deepfakeAnalyses.map((analysis, index) => (
              <TranscriptItem 
                key={index} 
                type={analysis.result.includes('Real') ? 'safe' : 'fraud'}
              >
                <p>{analysis.result}</p>
                <small>{analysis.timestamp}</small>
              </TranscriptItem>
            ))}
          </Panel>
        </ContentGrid>
      </AppContainer>
    </>
  );
};

export default SafeSpeakApp;