export default function greeting({ props }) {
  const who = typeof props?.who === 'string' ? props.who : 'world';
  return `<p data-island-test>Hello ${who} from an island</p>`;
}
