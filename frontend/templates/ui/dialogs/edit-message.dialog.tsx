'use client';

import { MessageChunk } from '@hale/types';
import {
  Dialog,
  DialogBody,
  DialogBottom,
  DialogContent,
  DialogHead,
} from '../dialog.model';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { CommonButton } from '@hale/components';
import { LuMailPlus } from 'react-icons/lu';

export default function EditMessageDialog({ close, open, message }: Props) {
  const [content, setContent] = useState(message.content);

  return (
    <Dialog open={open} close={close}>
      <DialogContent insideClassName="max-w-xl">
        <DialogHead className='flex items-center gap-3'>
          <LuMailPlus size={20}/>
          <div>
            <p className="text-sm font-medium">Edit Message</p>
            <p className="text-xs text-foreground/70">
              
            </p>
          </div>
        </DialogHead>

        <DialogBody className="space-y-4">
          <div>
            <p className="text-xs font-semibold my-1 text-foreground/70">
              Content
            </p>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Edit the content of your message"
              className={cn(
                'outline-none resize-none px-2 rounded-xl',
                'w-full py-2 placeholder:text-foreground/40',
                'overflow-y-auto max-h-32 border border-foreground/10',
                'placeholder:text-xs text-sm'
              )}
            />
          </div>

          <div>
            <p className="text-xs font-semibold my-1 text-foreground/70">
              Mentions
            </p>

            <div>
              {message.mentions.map((mention) => (
                <div key={mention.id}>
                  <p>{mention.source}</p>
                </div>
              ))}
            </div>
          </div>
        </DialogBody>

        <DialogBottom>
          <CommonButton>Save</CommonButton>
        </DialogBottom>
      </DialogContent>
    </Dialog>
  );
}

type Props = {
  open: boolean;
  close: () => void;
  message: MessageChunk;
};
