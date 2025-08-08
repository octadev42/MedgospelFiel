import {
    Image,
    ImageStyle,
    StyleProp,
    TouchableOpacity,
    TouchableOpacityProps,
    View,
    ViewProps,
    ViewStyle,
} from "react-native"
import { useAppTheme } from "@/utils/useAppTheme"

export type IconTypes = keyof typeof iconRegistry

type BaseIconProps = {
    /**
     * The name of the icon
     */
    icon: IconTypes

    /**
     * An optional tint color for the icon
     */
    color?: string

    /**
     * An optional size for the icon. If not provided, the icon will be sized to the icon's resolution.
     */
    size?: number

    /**
     * Style overrides for the icon image
     */
    style?: StyleProp<ImageStyle>

    /**
     * Style overrides for the icon container
     */
    containerStyle?: StyleProp<ViewStyle>
}

type PressableIconProps = Omit<TouchableOpacityProps, "style"> & BaseIconProps
type IconProps = Omit<ViewProps, "style"> & BaseIconProps

/**
 * A component to render a registered icon.
 * It is wrapped in a <TouchableOpacity />
 * @see [Documentation and Examples]{@link https://docs.infinite.red/ignite-cli/boilerplate/app/components/Icon/}
 * @param {PressableIconProps} props - The props for the `PressableIcon` component.
 * @returns {JSX.Element} The rendered `PressableIcon` component.
 */
export function PressableGridIcon(props: PressableIconProps) {
    const {
        icon,
        color,
        size,
        style: $imageStyleOverride,
        containerStyle: $containerStyleOverride,
        ...pressableProps
    } = props

    const { theme } = useAppTheme()

    const $imageStyle: StyleProp<ImageStyle> = [
        $imageStyleBase,
        size !== undefined && { width: size, height: size },
        $imageStyleOverride,
    ]

    return (
        <TouchableOpacity {...pressableProps} style={$containerStyleOverride}>
            <Image style={$imageStyle} source={iconRegistry[icon]} />
        </TouchableOpacity>
    )
}

/**
 * A component to render a registered icon.
 * It is wrapped in a <View />, use `PressableIcon` if you want to react to input
 * @see [Documentation and Examples]{@link https://docs.infinite.red/ignite-cli/boilerplate/app/components/Icon/}
 * @param {IconProps} props - The props for the `Icon` component.
 * @returns {JSX.Element} The rendered `Icon` component.
 */
export function WColorIcon(props: IconProps) {
    const {
        icon,
        color,
        size,
        style: $imageStyleOverride,
        containerStyle: $containerStyleOverride,
        ...viewProps
    } = props

    const { theme } = useAppTheme()

    const $imageStyle: StyleProp<ImageStyle> = [
        $imageStyleBase,
        size !== undefined && { width: size, height: size },
        $imageStyleOverride,
    ]

    return (
        <View {...viewProps} style={$containerStyleOverride}>
            <Image style={$imageStyle} source={iconRegistry[icon]} />
        </View>
    )
}

export const iconRegistry = {
    homegrid_cirurgias: require("@assets/icons/homegrid/cirurgias.png"),
    homegrid_consultas: require("@assets/icons/homegrid/consultas.png"),
    homegrid_exames_imagem: require("@assets/icons/homegrid/exames_imagem.png"),
    homegrid_exames_laboratoriais: require("@assets/icons/homegrid/exames_laboratoriais.png"),
    homegrid_nossos_precos: require("@assets/icons/homegrid/nossos_precos.png"),
    homegrid_procedimentos: require("@assets/icons/homegrid/procedimentos.png"),
    especialidades_neurologia: require("@assets/icons/especialidades/neurologia.png"),
    especialidades_pneumologia: require("@assets/icons/especialidades/pneumologia.png"),
    especialidades_gastroenterologia: require("@assets/icons/especialidades/gastro-enterologia.png"),
    more: require("@assets/icons/geral/more.png"),
}

const $imageStyleBase: ImageStyle = {
    resizeMode: "contain",
}
