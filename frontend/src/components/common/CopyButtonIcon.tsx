/* eslint-disable no-unused-vars */
import React, {useEffect, useState} from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ToolTip from '@material-ui/core/Tooltip';
import {CopyToClipboard} from 'react-copy-to-clipboard';


import {IconButton} from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';

interface Props {
    className?: string | undefined,
    textToCopy: string,
    description: string,
    edge?: false | 'end' | 'start' | undefined
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      borderRadius: 5,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      zIndex: 99,
    },
  }),
);

const CopyButtonIcon = ({className, textToCopy, description, edge}: Props) => {
  const classes = useStyles();
  const [copied, setCopied] = useState(false);

  //* set delay for copied tooltip
  useEffect(() => {
    if (copied) {
      setTimeout(()=> setCopied(false), 2000);
    }
  }, [copied]);

  return (
    <CopyToClipboard
      text={textToCopy}
      onCopy={()=> setCopied(true)}
    >
      <ToolTip
        title={`Copy ${description?? '?'}`}
        placement="top"
        // title='Meeting Copied!'
        // disableHoverListener={true}
        // disableFocusListener={true}
        // disableTouchListener={true}
        // open={copied}
      >
        <ListItemIcon>
          <IconButton
            className={className}
            edge={edge}
            aria-label='copy to clipboard'>
            <FileCopyIcon />
          </IconButton>
        </ListItemIcon>
      </ToolTip>
    </CopyToClipboard>
  );
};

export default CopyButtonIcon;
