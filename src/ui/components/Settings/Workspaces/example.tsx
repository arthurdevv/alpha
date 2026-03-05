import { useEffect, useRef, useState } from 'preact/hooks';
import { Cursor, Flex } from '../Appearance/styles';

const PROMPT_TEXTS = [
  `git pull
pnpm run dev
docker logs api`,
  `psql
prisma migrate dev
pnpm run build`,
  `pnpm run build
pm2 restart api`,
];

function getRandomText(ref?: string) {
  let text = ref;

  while (text === ref) {
    text = PROMPT_TEXTS[Math.floor(Math.random() * PROMPT_TEXTS.length)];
  }

  return text ?? '';
}

const PromptExample: React.FC<{ theme: ITheme }> = ({ theme }) => {
  const [displayed, setDisplayed] = useState<string>('');

  const prompt = useRef<string>(getRandomText());

  const chars = useRef<string[]>(prompt.current.split(''));

  useEffect(() => {
    let i = 0;
    let mode: 'typing' | 'deleting' = 'typing';
    let timeoutId: NodeJS.Timeout;

    const tick = () => {
      if (mode === 'typing') {
        setDisplayed(prev => prev + chars.current[i]);

        i += 1;

        if (i >= chars.current.length) {
          mode = 'deleting';

          timeoutId = setTimeout(tick, 800);
        } else {
          const delay = chars.current[i - 1] === '\n' ? 300 : 90;

          timeoutId = setTimeout(tick, delay);
        }
      } else {
        setDisplayed(prev => prev.slice(0, -1));

        i -= 1;

        if (i <= 0) {
          const randomText = getRandomText(prompt.current);

          prompt.current = randomText;
          chars.current = randomText.split('');

          mode = 'typing';
          i = 0;

          timeoutId = setTimeout(tick, 300);
        } else {
          timeoutId = setTimeout(tick, 50);
        }
      }
    };

    timeoutId = setTimeout(tick, 300);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <Flex $column $isCode>
      {displayed.split('\n').map((command, index, array) => (
        <Flex $column key={index}>
          <Flex key={index} $isCode>
            <pre dangerouslySetInnerHTML={{ __html: `$ ${command}` }} />
            {array.length - 1 === index && (
              <Cursor
                className="cursor focused"
                style={{ background: theme.cursor }}
              >
                &nbsp;
              </Cursor>
            )}
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
};

export default PromptExample;
