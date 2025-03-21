'use client';

import styles from '@demos/DemoSearchComponentTwo.module.scss';

import * as React from 'react';
import * as Utilities from '@common/utilities';

import Audio from '@system/svg/Audio';
import ActionItem from '@system/documents/ActionItem';
import Focus from '@system/svg/Focus';
import Plus from '@system/svg/Plus';
import Globe from '@system/svg/Globe';
import Search from '@system/svg/Search';
import Button from '@system/Button';

export default function DemoSearchComponentTwo(props) {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [images, setImages] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string>('');
  const [prompt, setPrompt] = React.useState('');
  
  const generateImages = async (inputPrompt: string) => {
    setIsGenerating(true);
    setError('');
    try {
      // Call our API route instead of Replicate directly
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: inputPrompt })
      });

      if (!response.ok) {
        throw new Error('Failed to generate images');
      }

      const { prediction } = await response.json();
      
      // Poll for results using our GET endpoint
      const checkResult = async () => {
        const resultResponse = await fetch(
          `/api/generate?id=${prediction.id}`
        );
        
        if (!resultResponse.ok) {
          throw new Error('Failed to check generation status');
        }
        
        const { prediction: result } = await resultResponse.json();
        
        if (result.status === "succeeded") {
          setImages(result.output);
          setIsGenerating(false);
        } else if (result.status === "failed") {
          setError("Image generation failed");
          setIsGenerating(false);
        } else {
          // Try again in 1 second
          setTimeout(checkResult, 1000);
        }
      };

      checkResult();
      
    } catch (error) {
      console.error('Error generating images:', error);
      setError('Failed to generate images');
      setIsGenerating(false);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.layout}>
        <div className={styles.containerGradient}>xxxx</div>
        <div className={styles.container}>
          <div className={styles.containerInput}>
            <input 
              className={styles.input} 
              placeholder="e.g., doctor, lawyer, artist..." 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <span className={styles.absoluteButton}>
              <Button
                onClick={() => {
                  if (prompt.trim()) {
                    generateImages(prompt.trim());
                  }
                }}
                style={{ fontWeight: 400 }}
                loading={isGenerating}
              >
                Generate Images
              </Button>
            </span>
          </div>
          
          {error && <div className={styles.error}>{error}</div>}
          
          {images.length > 0 && (
            <div className={styles.imageGrid}>
              {images.map((imageUrl, index) => (
                <img 
                  key={index}
                  src={imageUrl}
                  alt={`Generated headshot ${index + 1}`}
                  className={styles.generatedImage}
                />
              ))}
            </div>
          )}
        </div>
        <div className={styles.footer}>
          <ul className={styles.actions}>
            {/* <li className={styles.item}>
              <span className={styles.icon}>
                <Plus height="14px" />
              </span>
              <span className={styles.words}>Attach</span>
            </li>
            <li className={styles.item}>
              <span className={styles.icon}>
                <Focus height="16px" />
              </span>
              <span className={styles.words}>Focus on web</span>
            </li> */}
            <li className={styles.item}>
              <span className={styles.icon}>
                <Globe height="16px" />
              </span>
              <span className={styles.words}>Mitigate Bias</span>
            </li>
          </ul>
          {/* <ul className={styles.history}>
            <li className={styles.record}>
              Yesterday, you searched for{' '}
              <a href="#" className={styles.link}>
                "What is the perfect dog food?"
              </a>{' '}
              We found{' '}
              <a href="#" className={styles.link}>
                4,288 relevant results
              </a>
              , and today we've discovered{' '}
              <a href="#" className={styles.link}>
                24 more
              </a>
              . We have a question for you,{' '}
              <a href="#" className={styles.link}>
                what kind of dog do you have?
              </a>
            </li>
          </ul> */}
        </div>
      </div>
    </div>
  );
}
