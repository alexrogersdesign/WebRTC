MeetingCard example:

```js
import ObjectID from 'bson-objectid';

<MeetingCard meeting={{
    title: 'This is the meeting title',
    description: 'This is the meeting description',
    start: Date.now(),
    end: new Date(Date.now() + 30 * 60000),
    id: new ObjectID(),
}}/>
```