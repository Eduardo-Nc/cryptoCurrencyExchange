import { View, Text, TouchableOpacity, Modal, Image, TextInput, Alert } from 'react-native'
import React, { useState, useEffect,FC } from 'react'
import styles from './styles'

//Redux
import { useDispatch, useSelector } from 'react-redux';
import { setTotalBaseAccountData } from '../../../Home/redux/actions'
import { setPurchasedCoins, setTotalAmountInCoins } from '../../redux/actions'


//Components
import { ICONS } from '../../../../assets/icons';
import { COLORS } from '../../../../assets/styles';

//interfaces
export type coinItemObject = {
  id:string,
  image: string,
  name:string,
  current_price:string,
 };

 interface SendModal {
  coinItem: coinItemObject,
  isVisible:boolean,
setIsVisible:any
}


const BuyModal: FC<SendModal> = (props) => {

  const { isVisible, setIsVisible, coinItem } = props;

  //Redux
  const dispatch = useDispatch();
  const { totalBaseAccount } = useSelector((state:any) => state.home)
  const { purchasedCoins } = useSelector((state:any) => state.buy)


  const [quantity, setQuantity] = useState("");
  const [total, setTotal] = useState(0);

  const validateBuy = () => {
    if (Number(quantity) > 0) {
      if (total > totalBaseAccount) {
        Alert.alert("You do not have enough money to make the purchase")
      } else {
        let findCoins = purchasedCoins.find((c) => c.id === coinItem?.id)
        if (findCoins) {
          let totalQuantity = (Number(findCoins.quantity) + Number(quantity));
          let totalPrice = (Number(totalQuantity) * Number(coinItem?.current_price))
          let updateCoin = {
            ...findCoins,
            name: coinItem?.name,
            quantity: totalQuantity,
            totalPrice: totalPrice
          }
          let filterCoins = purchasedCoins.filter((c) => c.id !== coinItem?.id)
          dispatch(setTotalAmountInCoins(totalPrice))
          dispatch(setPurchasedCoins([...filterCoins, updateCoin]))
        } else {
          let filterCoins = purchasedCoins.filter((c) => c.id !== coinItem?.id)
          let totalPrice = (Number(quantity) * Number(coinItem?.current_price))
          dispatch(setPurchasedCoins([...filterCoins, {
            id: coinItem?.id,
            name: coinItem?.name,
            image: coinItem?.image,
            quantity: Number(quantity),
            price: coinItem?.current_price,
            totalPrice: totalPrice
          }]))
          dispatch(setTotalAmountInCoins(coinItem?.current_price))
        }

        dispatch(setTotalBaseAccountData(totalBaseAccount - total))
        setIsVisible(false)
        setQuantity("")
      }
    } else {
      // dispatch(setPurchasedCoins([]))
      Alert.alert("It is necessary to select a quantity.")
    }
  }

  useEffect(() => {
    let totalBuy = (quantity ? Number(quantity) : 0) * Number(coinItem?.current_price);
    setTotal(totalBuy)
  }, [quantity, coinItem])

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={() => {
        setIsVisible(false)
      }}
      statusBarTranslucent={true}
    >
      <View style={styles.mainContainer}>
        <View style={styles.container}>

          <TouchableOpacity
            onPress={() => {
              setIsVisible(false)
            }}
            style={styles.closeContainer}>
            <Image style={styles.iconClose} source={ICONS.cerrar} />
          </TouchableOpacity>

          <View style={styles.containerTitle}>
            <Text style={styles.txtTitle}>Name: {coinItem?.name}</Text>
            <Text style={styles.txtPrice}>Price: {coinItem?.current_price}</Text>
            <Text style={styles.txtTotal}>Total: {total}</Text>

          </View>

          <View style={styles.containerInput}>
            <TextInput
              style={styles.txtInput}
              keyboardType="number-pad"
              onChangeText={(text) => {
                setQuantity(text)
              }}
              value={quantity.toString()}
              placeholderTextColor={COLORS.PLACEHOLDER}
              placeholder={"Quantity to buy"}
            />
          </View>


          <TouchableOpacity
            disabled={false}
            onPress={() => {
              validateBuy()
            }}
            style={styles.containerBtnBuy}>
            <Text style={styles.btnBuy}>Buy</Text>
          </TouchableOpacity>


        </View>
      </View>
    </Modal>
  )
}

export default BuyModal