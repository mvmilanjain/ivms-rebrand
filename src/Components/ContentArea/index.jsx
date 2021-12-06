import {useViewportSize} from '@mantine/hooks';

const ContentArea = (props) => {
    const {height} = useViewportSize();

    return (
        <div style={{height: `${height - 128}px`}}>
            {props.children}
        </div>
    );

};

export default ContentArea;