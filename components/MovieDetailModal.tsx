// import React, { forwardRef, useMemo } from "react";
// import { View, useWindowDimensions, Image } from "react-native";

// import { List } from "../types/movieDetail";
// import { ScrollView } from "react-native-gesture-handler";
// import { Divider, Text, useTheme, Chip, IconButton } from "react-native-paper";
// import { useNavigation } from "@react-navigation/native";
// import { navigation } from "../types/StackParamlist";
// import { Category } from "../service/MovieService";
// import { decode } from "html-entities";

// interface Props {
//   movie: List;
//   handleClose: () => void;
// }
// const MovieDetailModal = forwardRef<BottomSheetModal, Props>((props, ref) => {
//   // ref
//   const theme = useTheme();
//   const { height, width } = useWindowDimensions();

//   const { movie, handleClose } = props;
//   // variables
//   const snapPoints = useMemo(() => [height - (width * 9) / 16, "100%"], []);

//   // callbacks

//   const navigation = useNavigation<navigation<"Category">>();
//   // renders

//   return (
//     <BottomSheetModal
//       enableDismissOnClose
//       enablePanDownToClose
//       ref={ref}
//       snapPoints={snapPoints}
//       backgroundStyle={{
//         backgroundColor: theme.colors.background,
//       }}
//       handleIndicatorStyle={{ backgroundColor: theme.colors.onSurfaceDisabled }}
//     >
//       <BottomSheetView>
//         <View
//           style={{
//             flexDirection: "row",
//             alignItems: "center",
//             justifyContent: "space-between",
//           }}
//         >
//           <Text
//             variant="titleLarge"
//             style={{ fontWeight: "bold", marginLeft: 10 }}
//           >
//             Nội dung mô tả
//           </Text>
//           <IconButton icon={"close"} onPress={handleClose} />
//         </View>
//         <Divider />
//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 80 }}
//         >
//           <Text
//             variant="titleMedium"
//             style={{ fontWeight: "bold", marginVertical: 4 }}
//           >
//             {decode(movie?.name)}
//           </Text>
//           <View style={{ width: "100%", gap: 2 }}>
//             <Text>Thể loại: {movie?.type_name}</Text>
//             <Text>Chất lượng: {movie?.quality}</Text>
//             <Text>Quốc gia: {movie?.country}</Text>

//             {movie?.tag && (
//               <View
//                 style={{
//                   flexDirection: "row",
//                   flexWrap: "wrap",
//                   alignItems: "center",
//                 }}
//               >
//                 <Text>Tag: </Text>
//                 <TouchableOpacity
//                   onPress={() => {
//                     navigation.push("Category", {
//                       categoryName: Category.other,
//                       title: movie?.tag,
//                       keyword: movie?.tag,
//                     });
//                     handleClose();
//                   }}
//                 >
//                   <Text
//                     style={{
//                       color: theme.colors.primary,
//                     }}
//                   >
//                     {movie?.tag}
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//             <View
//               style={{
//                 flexDirection: "row",
//                 flexWrap: "wrap",
//                 alignItems: "center",
//               }}
//             >
//               <Text>Diễn viên: </Text>
//               {movie?.actor.map((item) => (
//                 <TouchableOpacity
//                   key={item}
//                   disabled={item === "Updating"}
//                   onPress={() => {
//                     navigation.push("Category", {
//                       categoryName: Category.other,
//                       title: item,
//                       keyword: item,
//                     });
//                     handleClose();
//                   }}
//                 >
//                   <Text
//                     style={{
//                       color:
//                         item === "Updating"
//                           ? theme.colors.onSurfaceDisabled
//                           : theme.colors.primary,
//                     }}
//                   >
//                     {item}
//                     {movie?.actor.length > 1 && ", "}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>

//             <Text>Năm: {movie?.year}</Text>
//             <Text>Code: {movie?.movie_code}</Text>
//             {movie?.time && <Text>Thời lượng: {movie?.time}</Text>}
//             <View></View>
//           </View>
//           <View style={{ marginTop: 8 }}>
//             <Text
//               variant="bodyLarge"
//               style={{ fontWeight: "bold", marginBottom: 4 }}
//             >
//               Danh mục
//             </Text>
//             <View
//               style={{
//                 flexDirection: "row",
//                 flexWrap: "wrap",
//                 alignItems: "center",
//                 gap: 4,
//               }}
//             >
//               {movie?.category?.map((item) => (
//                 <Chip
//                   compact
//                   mode="flat"
//                   onPress={() => {
//                     navigation.navigate("Category", {
//                       categoryName: Category.other,
//                       title: item,
//                       keyword: item,
//                     });
//                     handleClose();
//                   }}
//                   key={item}
//                 >
//                   {item}
//                 </Chip>
//               ))}
//             </View>
//           </View>
//           <View style={{ marginTop: 8 }}>
//             <Text
//               variant="bodyLarge"
//               style={{
//                 fontWeight: "bold",

//                 marginBottom: 4,
//               }}
//             >
//               Các tập
//             </Text>
//             <View
//               style={{
//                 marginVertical: 4,
//               }}
//             >
//               <View
//                 style={{
//                   flexDirection: "row",
//                   alignItems: "center",
//                 }}
//               >
//                 <Image
//                   source={{ uri: movie?.thumb_url }}
//                   style={{
//                     width: 75,
//                     height: 100,
//                     borderRadius: 4,
//                   }}
//                 />
//                 <View style={{ marginLeft: 8, flex: 1, marginRight: 8 }}>
//                   <Text variant="titleSmall" numberOfLines={2}>
//                     {movie?.name}
//                   </Text>
//                   <Text
//                     variant="bodySmall"
//                     style={{
//                       textAlign: "justify",
//                     }}
//                   >
//                     {movie?.episodes?.server_data?.Full?.slug}
//                   </Text>
//                 </View>
//               </View>
//             </View>
//           </View>
//         </ScrollView>
//       </BottomSheetView>
//     </BottomSheetModal>
//   );
// });

// export default MovieDetailModal;
