<?php
/**
 * Created by PhpStorm.
 * User: diegobarrioh
 * Date: 21/8/15
 * Time: 11:09
 */

namespace AppBundle\Twig;

/**
 * Class AppExtension
 *
 * @package AppBundle\Twig
 */
class AppExtension extends \Twig_Extension
{

    /**
     * Añado mi función a la lista de funciones disponibles
     *
     * @return array
     */
    public function getFunctions()
    {
        return array(
            new \Twig_SimpleFunction('spinner', array($this, 'spinner'), array('is_safe' => array('html'))),
            new \Twig_SimpleFunction('formatDateDiff', array($this, 'formatDateDiff')),
            new \Twig_SimpleFunction('formatAge', array($this, 'formatAge')),
            new \Twig_SimpleFunction('iconForMedicine', array($this, 'iconForMedicine')),
            new \Twig_SimpleFunction('iconForFood', array($this, 'iconForFood')),
        );
    }

    /**
     * @param int    $step
     * @param int    $default
     * @param string $unitName
     *
     * @return string
     */
    public function spinner($step = 10, $default = 10, $unitName = 'ml')
    {
        $buttonLeft  = '<button type="button" class="btn btn-success spinner-left">'."\n"."\t".'<i class="fa fa-caret-left"></i>'."\n".'</button>';
        $buttonRight = '<button type="button" class="btn btn-success spinner-right">'."\n"."\t".'<i class="fa fa-caret-right"></i>'."\n".'</button>';
        $amount      = '<span class="amount">'.$default.'</span>';
        $unit        = '<span class="unit">'.$unitName.'</span>';

        return '<div class="spinner" data-step="'.$step.'" data-value="'.$default.'">'."\n".$buttonLeft."\n".$amount."\n".$unit."\n".$buttonRight."\n".'</div>';
    }

    /**
     * Formatea la fecha de nacimiento en años meses y días
     *
     * @param string $born
     *
     * @return mixed
     */
    public function formatAge($born)
    {
        if (!($born instanceof \DateTime)) {
            $start = new \DateTime($born);
        } else {
            $start = $born;
        }

        $end = new \DateTime('now');

        $interval = $end->diff($start);
        $format   = array();
        if ($interval->y !== 0) {
            $format[] = '%y '.(($interval->y == 1) ? 'año' : 'años');
        }
        if ($interval->m !== 0) {
            $format[] = '%m '.(($interval->m == 1) ? 'mes' : 'meses');
        }
        if ($interval->d !== 0) {
            $format[] = '%d '.(($interval->d == 1) ? 'dia' : 'dias');
        }

        // We use the two biggest parts
        if (count($format) > 1) {
            $format = array_shift($format)." y ".array_shift($format);
        } else {
            $format = array_pop($format);
        }

        return $interval->format($format);
    }

    /**
     * @param string $arr
     *
     * @return bool
     */
    public function isAssoc($arr)
    {
        return array_keys($arr) !== range(0, count($arr) - 1);
    }

    /**
     * @param string $name
     *
     * @return string
     */
    public function iconForMedicine($name)
    {
        switch ($name) {
            case 'Vitamin D':
                return 'icon-sun';

            case 'Antacid':
            case 'Zantac':
                return 'fa fa-fire-extinguisher';

            case 'Gripe Water':
                return 'icon-baby-crying';

            case 'Saline':
            case 'Saline Drop':
            case 'Saline Drops':
                return 'fa fa-tint';

            default:
                break;
        }

        return 'fa fa-star';
    }

    /**
     * @param string $name
     *
     * @return string
     */
    public function iconForFood($name)
    {
        switch (strtolower($name)) {
            case 'fruit':
                return 'fa fa-apple';

            default:
                break;
        }

        return 'fa fa-cutlery';
    }

    /**
     * @inheritdoc
     * @return string
     */
    public function getName()
    {
        return 'app.extension';
    }
}
