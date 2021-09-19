/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import React, {Component} from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import cx from 'clsx';
import Grid from '@material-ui/core/Grid';
// import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import TagFaces from '@material-ui/icons/TagFaces';
import Reply from '@material-ui/icons/Reply';
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import Box from '@material-ui/core/Box';


import {Side, Message, User} from '../../types';
import VideoAvatar from '../VideoAvatar';

const size = 30;
const useStyles = makeStyles(({palette, spacing}) =>
  createStyles({
  // if you want the same as facebook messenger, use this color '#09f'
    avatar: {
      width: size,
      height: size,
    },
    rightRow: {
      marginLeft: 'auto',
    },
    leftRow: {
      marginRight: 'auto',
    },
    msgBox: {
      'display': 'flex',
      'alignItems': 'center',
      'marginBottom': 4,
      '&:hover $iconBtn': {
        opacity: 1,
      },
    },
    leftMsgBox: {
      textAlign: 'left',
    },
    rightMsgBox: {
      textAlign: 'right',
      flexDirection: 'row-reverse',
    },
    msg: {
      maxWidth: '70%',
      padding: spacing(1, 2),
      borderRadius: 4,
      display: 'inline-block',
      wordBreak: 'break-word',
      fontFamily:
        // eslint-disable-next-line max-len
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      fontSize: '14px',
    },
    left: {
      borderTopRightRadius: spacing(2.5),
      borderBottomRightRadius: spacing(2.5),
      backgroundColor: palette.grey[100],
    },
    right: {
      borderTopLeftRadius: spacing(2.5),
      borderBottomLeftRadius: spacing(2.5),
      backgroundColor: palette.primary.main,
      color: palette.common.white,
    },
    leftFirst: {
      borderTopLeftRadius: spacing(2.5),
    },
    leftLast: {
      borderBottomLeftRadius: spacing(2.5),
    },
    rightFirst: {
      borderTopRightRadius: spacing(2.5),
    },
    rightLast: {
      borderBottomRightRadius: spacing(2.5),
    },
    iconBtn: {
      'opacity': 0,
      'padding': 6,
      'color': 'rgba(0,0,0,0.34)',
      '&:hover': {
        color: 'rgba(0,0,0,0.87)',
      },
      'margin': '0 4px',
      '& svg': {
        fontSize: 20,
      },
    },
    image: {
      maxWidth: 120,
      maxHeight: 120,
    },
    date: {
      fontWeight: 500,
      color: 'rgba(0,0,0,0.4)',
      margin: '12px 0',
      fontSize: 12,
      textAlign: 'center',
    },
    row: {

    },
  }),
);

interface Props {
  user: User,
  messages: Message[],
  side: Side,
}


const ChatMessage = ({user, messages, side}: Props) => {
  const classes = useStyles();
  const attachClass = (index: number) => {
    if (index === 0) {
      return classes[`${side}First`];
    }
    if (index === messages.length - 1) {
      return classes[`${side}Last`];
    }
    return '';
  };

  return (
    <Box p={'16px 30px 12px 10px'}>
      <Typography className={classes.date}>{messages[0].timeStamp.toLocaleTimeString()}</Typography>
      <Grid
        container
        spacing={2}
        justify={side === 'right' ? 'flex-end' : 'flex-start'}
      >
        {side === 'left' && (
          <Grid item>
            <VideoAvatar user={user} className={cx(classes.avatar)} />
          </Grid>
        )}
        <Grid item xs>
          {messages.map((msg, i) => {
            return (
            // eslint-disable-next-line react/no-array-index-key
              <div
                key={msg.id || i}
                className={cx(classes.row, classes[`${side}Row`])}
                // className={classes[`${side}Row`]}
                // className={side === 'left'? classes.left : classes.rightRow }
              >
                <div className={cx(classes.msgBox, classes[`${side}MsgBox`])}>
                  {typeof msg === 'string' && (
                    <Typography
                      align={'left'}
                      className={cx(classes.msg, classes[side], attachClass(i))}
                    >
                      {msg}
                    </Typography>
                  )}
                  {typeof msg === 'object' && msg.type === 'image' && (
                    <img className={classes.image} alt={msg.alt} {...msg} />
                  )}
                  <IconButton className={classes.iconBtn}>
                    <TagFaces />
                  </IconButton>
                  <IconButton className={classes.iconBtn}>
                    <Reply />
                  </IconButton>
                  <IconButton className={classes.iconBtn}>
                    <MoreHoriz />
                  </IconButton>
                </div>
              </div>
            );
          })}
        </Grid>
      </Grid>
    </Box>

  );
};

export default ChatMessage;
