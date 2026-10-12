# Device protocol

These notes describe `NetworkService.java` and the launcher `MainActivity.java` in the two source projects.

## Transport

Each TCP message has an eight-byte header followed by the payload. The header contains two big-endian 32-bit integers: payload length in bytes, then data type (`0` for text, `1` for image). The receiver accepts payload lengths from 1 byte to 10 MiB. Commands are UTF-8 JSON carried as type `0` messages. A plain JSON line without the binary header is not a valid frame.

Text responses use `type`, a string-valued `content`, and an optional `timestamp`. Image content is Base64-encoded image data. Image frames may contain a JSON envelope or Base64 text. See `handleTextData` and `handleImageData` for the exact parsing behavior.

## Commands

Commands below include `client_id: "android_1"`.

| Action | Generation | Meaning in the app |
| --- | --- | --- |
| `get_image` | Both | Request an image/result update. |
| `get_tem` | Both | Request temperature. |
| `set_tem` | Both | Send a numeric `value` to the temperature controller. |
| `set_tem43` | Second | Send `value` 1 or 0 from the 43-degree switch. |
| `set_tem90` | Second | Send `value` 1 or 0 from the 90-degree switch. |
| `set_servo` | Second | Send a numeric `value` from the servo controls. |

Example image request payload:

```json
{"action":"get_image","client_id":"android_1"}
```

The network service also sends heartbeat messages after a socket read timeout. Firmware must interpret hardware command values consistently with the chosen app; the server and firmware are not included in these directories.

## Responses

Both generations handle `image`, `text`, `status`, and `tem`. The first uses `tube` for two-tube labels and `Data` for plotted data. The second uses `tubelabels` for five-tube labels and `tubeluminance` for plotted data. In the supplied second-generation client, the `tubeluminance` content object contains the numeric fields `data1` and `data2`; these values are added to the two chart series. These names are case-sensitive.

Illustrative second-generation tube response payload (an interface example, not a measurement):

```json
{"type":"tubelabels","content":"{\"tube1\":\"0\",\"tube2\":\"1\",\"tube3\":\"2\",\"tube4\":\"3\",\"tube5\":\"0\"}"}
```

With the eight-byte frame header, this payload should display green, red, blue, null, and green tube labels respectively. A temperature payload such as `{"type":"tem","content":"25.0"}` should display `25.0°C`. These examples describe the source handlers and have not been verified against hardware during this import.
