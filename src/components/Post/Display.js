import { ImageList, ImageListItem, ImageListItemBar } from '@mui/material';
import Like from '../UI/Like';
import classes from './Post.module.css';
import DeletePost from './DeletePost';
import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined';

const Display = props => {
  const count = props.post.length;
  const imgPath = 'http://192.168.1.241:8000';

  return (
    <>
      <ImageList variant="masonry" style={{ marginTop: '5rem' }} cols={3}>
        <div className={classes.imageGallery}>
          {count
            ? props.post.map(item => {
                return (
                  <ImageListItem
                    key={item._id}
                    className={classes.pics}
                    // onClick={() => {
                    //   getImgSrc(`${imgPath}${item.image}`);
                    // }}
                  >
                    <img
                      src={`${imgPath}${item.image}`}
                      alt={item.title}
                      loading="lazy"
                      style={{ borderRadius: '10px' }}
                    />

                    <ImageListItemBar
                      position="top"
                      subtitle={
                        <span>
                          <DeletePost post={item} setPost={props.setPost} />
                        </span>
                      }
                      style={{
                        background: 'transparent',
                        textAlign: 'end',
                        borderRadius: '10px',
                        marginRight: 0,
                        marginLeft: 'auto',
                      }}
                    ></ImageListItemBar>

                    <ImageListItemBar
                      title={
                        <div
                          style={{
                            textAlign: 'left',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              padding: '5px',
                              justifyContent: 'space-between',
                            }}
                          >
                            <span
                              style={{
                                display: 'flex',
                              }}
                            >
                              <span>
                                <Like
                                  itemId={item._id}
                                  isLike={item.isLike}
                                  totalLike={item.totalLike}
                                />
                              </span>
                            </span>

                            <span>
                              <AddCommentOutlinedIcon />
                            </span>
                          </div>
                          <span style={{ fontWeight: 900 }}>
                            @{item.creator?.name}
                          </span>
                          {'    '}
                          {item.caption}
                        </div>
                      }
                      subtitle={
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                          }}
                        >
                          <span>
                            {new Date(item.createdAt).toLocaleString('en-us', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                          &nbsp; &nbsp; &nbsp;
                          <span> {item.postTime}</span>
                        </div>
                      }
                      position="below"
                      style={{ borderRadius: '10px', height: '5rem' }}
                    />
                  </ImageListItem>
                );
              })
            : null}
        </div>
      </ImageList>
    </>
  );
};
export default Display;
