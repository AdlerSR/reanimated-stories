import React from 'react';
import {FlatList, StyleSheet, ViewToken} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import Page from './Page';

interface Data {
  id: number;
  title: string;
}

interface ChangeStoriesProps {
  viewableItems: ViewToken[];
  changed: ViewToken[];
}

const data: Array<Data> = [
  {id: 1, title: 'texto 1'},
  {id: 2, title: 'texto 2'},
  {id: 3, title: 'texto 3'},
  {id: 4, title: 'texto 4'},
  {id: 5, title: 'texto 5'},
];

export default function App() {
  const flatListRef = React.useRef<FlatList<any>>(null);
  const translateX = useSharedValue(0);
  const [test, setTest] = React.useState<Array<Data>>([]);

  const AnimatedFlatList = Animated.createAnimatedComponent(
    FlatList as new () => FlatList<Data>,
  );

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateX.value = event.contentOffset.x;
  });

  const indexChanged = React.useRef((info: ChangeStoriesProps) => {
    setTest(info.viewableItems.map(items => items.item[0]));
  });

  const onPressPrevious = () => {
    flatListRef.current?.scrollToIndex({index: 2});
  };

  React.useEffect(() => {
    if (flatListRef.current) {
      onPressPrevious();
    }
  }, []);

  return (
    <AnimatedFlatList
      style={styles.container}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      ref={flatListRef}
      pagingEnabled
      horizontal
      data={data}
      bounces={false}
      keyExtractor={({id}) => {
        return id as any;
      }}
      onScrollToIndexFailed={() => {
        const wait = new Promise(resolve => setTimeout(resolve, 500));
        wait.then(() => {
          flatListRef.current?.scrollToIndex({
            index: 2,
            animated: true,
          });
        });
      }}
      showsHorizontalScrollIndicator={false}
      renderItem={({item, index}) => {
        return (
          <Page
            translateX={translateX}
            index={index}
            ref={flatListRef}
            lastIndex={data.length}
            actualScreen={test}
            item={item}
          />
        );
      }}
      onViewableItemsChanged={indexChanged.current}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
