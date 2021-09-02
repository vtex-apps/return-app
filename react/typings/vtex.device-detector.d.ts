declare module 'vtex.device-detector/useDevice' {
  interface Device {
    device: 'phone' | 'tablet' | 'desktop'
    isMobile: boolean
  }

  export default function useDevice(): Device
}
