import * as express from 'express';

/**
 * Device that is in the network
 */
export interface NetworkDevice {
  /**
   * IP of the device
   */
  ip?: string;
  /**
   * MAC address of the device
   */
  mac: string;
  /**
   * Name of the device
   */
  name?: string;
  /**
   * Whether or not this device is trusted
   */
  trusted?: boolean;
  /**
   * Vendor of the device
   */
  vendor?: string;
}

/**
 * Response from Motion API
 */
export interface MotionAPIResponse<T> {
  /**
   * Data of the response
   */
  data?: T;

  /**
   * Message that describes the response
   */
  message?: string;

  /**
   * Status of the response
   */
  status: boolean;
}

/**
 * Request to the Motion API
 */
export interface MotionAPIRequest<T> extends express.Request {
  /**
   * Body of the request
   */
  body: T;
}

/**
 * Request to trust a MAC address
 */
export interface MotionAPITrustRequest extends MotionAPIUntrustRequest {
  name: string;
}

/**
 * Request to untrust a MAC address
 */
export interface MotionAPIUntrustRequest {
  mac: string;
}

/**
 * List of possible modes
 */
export enum MotionMode {
  on = 'on',
  auto = 'auto',
  off = 'off',
}
