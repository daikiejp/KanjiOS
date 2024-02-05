'use client';

import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

interface CopySentenceProps {
  sentence: string;
}

export default function CopySentence({ sentence }: CopySentenceProps) {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isCopied) {
      toast({
        title: 'Success',
        description: 'Sentence copied!',
        duration: 1000,
      });

      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sentence);
      setIsCopied(true);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="text-primary hover:text-primary-foreground hover:bg-primary"
          >
            {isCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="sr-only">
              {isCopied ? 'Copied!' : 'Copy sentence'}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isCopied ? 'Copied!' : 'Copy sentence'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
