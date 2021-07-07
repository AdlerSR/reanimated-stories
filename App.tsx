import React from 'react';
import {FlatList, StyleSheet, ViewToken} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {Page} from './Page';

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
  const translateX = useSharedValue(0);

  const AnimatedFlatList = Animated.createAnimatedComponent(
    FlatList as new () => FlatList<Data>,
  );

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateX.value = event.contentOffset.x;
  });

  const indexChanged = React.useRef((info: ChangeStoriesProps) => {
    //pega os dados atuais da tela em exibição
    console.log(info.viewableItems.map(items => items.item));
  });

  return (
    <AnimatedFlatList
      style={styles.container}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      pagingEnabled
      horizontal
      data={data}
      bounces={false}
      keyExtractor={({id}) => {
        return id as any;
      }}
      showsHorizontalScrollIndicator={false}
      renderItem={({item: {title}, index}) => {
        return <Page title={title} translateX={translateX} index={index} />;
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
