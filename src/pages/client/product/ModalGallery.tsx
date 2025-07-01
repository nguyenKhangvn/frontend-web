import { Col, Image, Modal, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import ImageGallery from 'react-image-gallery';
import './product.scss';

interface ModalGalleryProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    currentIndex: number;
    items: { original: string; thumbnail: string }[];
    title: string;
}

const ModalGallery = ({ isOpen, setIsOpen, currentIndex, items, title } : ModalGalleryProps) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const refGallery = useRef<ImageGallery>(null);

    useEffect(() => {
        if (isOpen) {
            setActiveIndex(currentIndex);
        }
    }, [isOpen, currentIndex]);

    return (
        <Modal
            width={'60vw'}
            open={isOpen}
            onCancel={() => setIsOpen(false)}
            footer={null} // Hide footer
            closable={false} // Hide close button
            className="modal-gallery"
        >
            <Row gutter={[20, 20]}>
                <Col span={16}>
                    <ImageGallery
                        ref={refGallery}
                        items={items}
                        showPlayButton={false} // Hide play button
                        showFullscreenButton={false} // Hide fullscreen button
                        startIndex={currentIndex} // Start at current index
                        showThumbnails={false} // Hide thumbnails
                        onSlide={(i) => setActiveIndex(i)}
                        slideDuration={0} // Duration between slides
                    />
                </Col>
                <Col span={8}>
                    <div style={{ padding: "5px 0 20px 0", fontWeight: "bold" }}>{title}</div>
                    <div>
                        <Row gutter={[20, 20]}>
                            {items?.map((item, i) => (
                                <Col key={`image-${i}`}>
                                    <Image
                                        wrapperClassName={"img-normal"}
                                        width={100}
                                        height={100}
                                        src={item.original}
                                        preview={false}
                                        onClick={() => {
                                            refGallery.current?.slideToIndex(i);
                                            setActiveIndex(i);
                                        }}
                                    />
                                    <div className={activeIndex === i ? "active" : ""}></div>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </Col>
            </Row>
        </Modal>
    );
};

export default ModalGallery;