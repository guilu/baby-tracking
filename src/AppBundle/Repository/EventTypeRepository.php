<?php
/**
 * Created by PhpStorm.
 * User: diegobarrioh
 * Date: 21/8/15
 * Time: 8:58
 */

namespace AppBundle\Repository;

use Doctrine\ORM\EntityRepository;

/**
 * This custom Doctrine repository contains some methods which are useful when
 * querying for EventTypes information.
 *
 * @author Diego Barrio <diegobarrioh@gmail.com>
 */
class EventTypeRepository extends EntityRepository
{
    /**
     *
     * @return array
     */
    public function findLatest()
    {
        return $this
            ->createQueryBuilder('et')
            ->select('et')
            ->where('et.createdAt <= :now')->setParameter('now', new \DateTime())
            ->orderBy('et.createdAt', 'DESC')
            ->getQuery()
            ->getResult()
            ;
    }

}
