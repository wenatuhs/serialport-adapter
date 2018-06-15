const TEST = process.env.TEST
const PORT_PATH = process.env.PORT_PATH || '/dev/test'

let BAUD_RATE
try {
  BAUD_RATE = parseInt(process.env.BAUD_RATE)
} catch (err) {
  // Do nothing
}
if (!BAUD_RATE) {
  BAUD_RATE = 9600
}

let SerialPort, MockBinding

if (TEST) {
  SerialPort = require('serialport/test')
  MockBinding = SerialPort.Binding

  MockBinding.createPort(PORT_PATH, {
    echo: false,
    record: false,
  })
} else {
  SerialPort = require('serialport')
}

try {
  // console.log(typeof BAUD_RATE, BAUD_RATE)
  const port = new SerialPort(PORT_PATH, {
    baudRate: BAUD_RATE
  })
  
  port.on('error', (err) => {
    console.error('runtime error:', err.message)
  })
  
  port.on('open', () => {
    console.log('port opened:', port.path)
  
    if (TEST) {
      port.binding.emitData(Buffer.from('Hello'))
      setTimeout(() => {
        port.binding.emitData(Buffer.from('Bye'))
      }, 2000)
    }
  })
  
  port.on('data', (data) => {
    console.log('data received:', data.toString('utf8'))
  })
  
  if (TEST) {
    MockBinding.reset()
  }
} catch (err) {
  console.error('fatal error:', err.message)
}
